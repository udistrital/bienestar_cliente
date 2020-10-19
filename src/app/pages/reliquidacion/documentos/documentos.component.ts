import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';

@Component({
  selector: 'ngx-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss']
})
export class DocumentosComponent implements OnInit {

  form: FormGroup;
  docItems = ["Certificado de Sisben", "Certificado de Estratificación", "Nomina"]

  constructor(private formBuilder: FormBuilder) {
    this.buildForm();
  }

  ngOnInit() {
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
      console.log(this.form.value)
      // swal.fire({
      //   title: 'Espere',
      //   text: 'Guardando Información',
      //   allowOutsideClick: false,
      // });
      // swal.showLoading();
      // this.dependency = this.form.value;
      // this.dependency.DependenciaTipoDependencia = [];
      // this.dependencyService
      //   .createDependency(this.dependency)
      //   .subscribe((newDependency) => {
      //     swal.fire({
      //       title: `Éxito al crear un nueva dependencia.`,
      //       icon: 'success',
      //       text: 'Información Guardada correctamente',
      //     });
      //     this.router.navigate([`./dependency-list`]);
      //   });
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
