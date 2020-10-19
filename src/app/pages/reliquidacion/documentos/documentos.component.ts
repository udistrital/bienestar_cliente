import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { DocumentosService } from '../../../@core/data/documentos.service';
import { ImplicitAutenticationService } from '../../../@core/utils/implicit_autentication.service';

@Component({
  selector: 'ngx-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss']
})
export class DocumentosComponent implements OnInit {

  form: FormGroup;
  docItems = []
  infoForm: any;
  filesUp: any;

  constructor(
    private formBuilder: FormBuilder, 
    private authenticationService: ImplicitAutenticationService,
    private nuxeoService: DocumentosService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.docItems.push(params.doc);
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      Item: ['', [Validators.required]],
      Observaciones: ['', [Validators.required]],
      Documento: ['', Validators.required],
      DocInfo: ['', Validators.required]
    });
  }

  validationField(field) {
    return this.form.get(field).invalid && this.form.get(field).touched;
  }

  uploadDocument(event) {
    if (!this.form.invalid) {
      swal.fire({
        title: 'Espere',
        text: 'Guardando Información',
        allowOutsideClick: false,
      });
      swal.showLoading();
      const files = []
      this.infoForm = <any>this.form.value;
      if (this.infoForm.DocInfo !== undefined) {
        files.push({
          nombre: this.authenticationService.getPayload().sub,
          name: this.authenticationService.getPayload().sub,
          key: 'SoportePago',
          file: this.infoForm.DocInfo, 
          IdDocumento: 8,
        });
      }
      this.nuxeoService.getDocumentos(files).subscribe(response => {
        console.log(response)
        this.filesUp = <any>response;
        if (this.filesUp['SoportePago'] !== undefined) {
          this.infoForm.Comprobante = this.filesUp['SoportePago'].Id;
          swal.fire({
            title: `Éxito al cargar archivo con id: ${this.filesUp['SoportePago'].Id}`,
            text: 'Información Guardada correctamente',
          });
          this.location.back();
        }
      })
    } else {
      alert("ooopss!!!!")
      // swal.fire({
      //   icon: 'error',
      //   title: 'Oops...',
      //   text: 'Algún dato quedo incompleto',
      // });
    }
  }

  onFileChange(event) {
    const reader = new FileReader();
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.patchValue({
          Documento: reader.result,
          DocInfo: file
        });
      };
    }
  }

}
