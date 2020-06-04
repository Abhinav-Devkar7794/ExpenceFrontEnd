import React, { Component } from 'react';
import AppNav from './AppNav'
import DatePicker from "react-datepicker";
 
import "react-datepicker/dist/react-datepicker.css";

import './App.css';
import {Table, FormGroup , Form, Button ,Container } from 'reactstrap';

import {Link} from 'react-router-dom'

import Moment from 'react-moment'



class Expenses extends Component {


    // {
    //     "id": 100,
    //     "expensedate": "2019-06-16T17:00:00Z",
    //     "descript": "US",
    //     "location": "surat",
    //     "category": {
    //       "id": 1,
    //       "name": "Travel"
    //     }
    //   }


    emptyItem={

        id:103,
        expensedate:new Date(),
        descript : '',
        location:'',
        categories:[1,'Travel']
    }


    constructor(props){

        super(props);

        this.state={
            date : new Date(),
            isLoading : true,
            Expenses:[],
            categories : [],
            item:this.emptyItem
        }

        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.handleDateChange=this.handleDateChange.bind(this);

    }


  
      async componentDidMount(){

        const response = await fetch('/api/categories');
        const body = await response.json();
        this.setState({ categories : body , isLoading : false })


        const responseExp = await fetch('/api/expenses');
        const bodyExp = await responseExp.json();
        this.setState({ Expenses : bodyExp , isLoading : false })




      }

    async remove(id){

        await fetch('/api/expenses/${id}',{
            method:'DELETE',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            }
        }).then(() => {
            let updateExpense = this.state.Expenses.filter(i => i.id !== id);
            this.setState({Expenses : updateExpense})
        })

    }


    handleChange(event){

        const target = event.target;
        const value = target.value;
        const  name=target.name;

        let item ={...this.state.item};

        item[name] = value;

        this.setState({item});

        console.log(this.state.item)

    }

    handleDateChange(date){

        let item={...this.state.item};
        item.expensedate=date;

        this.setState({item})

        console.log(item);
    }



    async handleSubmit(event){

        event.preventDefault();
        const {item} = this.state
        await fetch('/api/expenses',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify(item) 

        })


        console.log(this.state);
        this.props.history.push("/expenses");
    }
     

    render() { 

        const title=<h3>Add Expense</h3>;

        const {categories} = this.state

        const {Expenses , isLoading}=this.state

        if(isLoading)
        return(<div>Loding...</div>)

        // let optionList = categories.map(category =>
        //         <option id={category.id}>{category.name}</option>
        //     )

    //     let  row=Expenses.map( expense =>

    //         <tr key={expense.id}>
    //             <td>{expense.descript}</td>
    //             <td>{expense.location}</td>
    //             <td>{expense.expensedate}</td>
    //             <td>{expense.category.name}</td>  
    //             <td><Button size="sm" color="danger"  onClick={ () => this.remove(expense.id) } >Delete</Button></td>
    //         </tr>

    //   )

        return ( <div>
                <AppNav/>

                <Container>
                    {title}


                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <label for="title">Title</label>
                            <input type="text" name="title" id="title" onChange={this.handleChange} 
                            autoComplete="name"
                            />
                        </FormGroup>
                        <FormGroup>
                            <label for="category">Category</label>
                            <select> 
                                <option>--Select Travel--</option>
                                {
                                        categories.map(category =>
                                        <option id={category.id}>{category.name}</option>
                                        )
                                }
                            </select>  
                        </FormGroup>

                        <FormGroup>
                            <label for="expenseDate">Expense Date</label>
                            <DatePicker selected={this.state.item.expensedate} onChange={this.handleDateChange}/>
                        </FormGroup>

                        <div  className="row">
                        <FormGroup className="col-md-4 mb-3">
                            <label for="location">Location</label>
                            <input type="text" name="location" id="location" onChange={this.handleChange}/>
                        </FormGroup>
                        </div>
                        <FormGroup>
                            <Button type="submit"   color="primary" >Save</Button>{' '}
                            <Button color="secondary" tag={Link} to="/">Cancel</Button>
                        </FormGroup>


                    </Form>
                </Container>

                {' '}

                <Container>

                    <h3>Expense List</h3>

                    <Table className="mt-4">

                        <thead>
                            <tr>
                                <th width="20%">Description</th>
                                <th width="10%"> Location</th>
                                <th width="10%">  Date</th>
                                <th>Category</th>
                                <th width="10%">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Expenses.map( expense =>

                                        <tr key={expense.id}>
                                            <td>{expense.descript}</td>
                                            <td>{expense.location}</td>
                                            <td><Moment  date={expense.expensedate} format="YYYY/MM/DD" /></td>
                                            <td>{expense.category.name}</td>  
                                            <td><Button size="sm" color="danger"  onClick={ () => this.remove(expense.id) } >Delete</Button></td>
                                        </tr>

                                        )
                                        
                            }
                        </tbody>
                    </Table>

                </Container>

        </div> );
    }
}
 
export default Expenses;