import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Employee } from 'src/app/employee.model';
import { ApiService } from 'src/app/shared/api.service';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {

  formValue !: FormGroup;
  employee : Employee = new Employee();
  employees!:Employee[];
  updating:boolean = false;
  constructor(private formbuilder:FormBuilder,
    private api:ApiService
  ) { }

  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
      firstname : [''],
      lastname : [''],
      email: [''],
      mobile: [''],
      salary : ['']
    })
    this.getEmployees()
  }

  getEmployees() {
    this.api.getEmployee()
    .subscribe(res => { this.employees = res; },
      err=> { console.log(`Could not successfully retrieve employees. Reason ${err.message}`) })
  }

  postEmployee() {
    this.employee.firstName = this.formValue.value.firstname;
    this.employee.lastName = this.formValue.value.lastname;
    this.employee.email = this.formValue.value.email;
    this.employee.mobile = this.formValue.value.mobile;
    this.employee.salary = this.formValue.value.salary;

    this.api.postEmployee(this.employee)
    .subscribe(res => {
      console.log(res);
      this.cancelForm();
      this.getEmployees();
    },
    err=> {
      console.log("Something went wrong");
    })
  }

  editEmployee(employee:Employee) {
    this.employee = employee;
    this.formValue.controls['firstname'].setValue(this.employee.firstName)
    this.formValue.controls['lastname'].setValue(this.employee.lastName)
    this.formValue.controls['email'].setValue(this.employee.email)
    this.formValue.controls['mobile'].setValue(this.employee.mobile)
    this.formValue.controls['salary'].setValue(this.employee.salary)
    this.updating = true;
  }

  updateEmployee() {
    this.employee.firstName = this.formValue.value.firstname;
    this.employee.lastName = this.formValue.value.lastname;
    this.employee.email = this.formValue.value.email;
    this.employee.mobile = this.formValue.value.mobile;
    this.employee.salary = this.formValue.value.salary;

    this.api.updateEmployee(this.employee, this.employee.id)
    .subscribe(res => {
      console.log(res)
      this.cancelForm()
    },
    err => {
      console.log(`Something happened while updating employee. ${err.message}`)
    })
  }

  dropEmployee(id:number) {
    this.api.deleteEmployee(id) 
    .subscribe(res => {
      console.log("Employee deleted")
      this.employees = this.employees.filter(employee => { return employee.id!= id })
    },
    err => {
      console.log(`Something happened while deleting. ${err.message}`)
    })
  }

  cancelForm() {
    this.formValue.reset();
    this.updating = false;
    this.employee = new Employee();
  }

}
