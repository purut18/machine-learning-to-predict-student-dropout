import React, { Component } from 'react';
import axios from 'axios';

import './Predict.css';
import { tsExpressionWithTypeArguments } from '@babel/types';

class Predict extends Component {

    state = {
        gender: 'M',
        income: null,
        attendance: null,
        caste: 'gen',
        disabled: 0,
        class: '4',
        marks: null,
        distanceBlur: null,
        attendanceBlur: null,
        incomeBlur: null,
        marksBlur: null,
        csvFile: null,
        predFile: null,
        uploadFile: true,
        uplaodError: null,
        prediction: null,
        predError: null,
        predResults: null
    }

    handleGenderChange = (event) => {
        this.setState({
            gender: event.target.value
        })
    }

    handleIncomeChange = (event) => {
        this.setState({
            income: event.target.value
        })
    }

    handleCasteChange = (event) => {
        this.setState({
            caste: event.target.value
        })
    }

    handleClassChange = (event) => {
        this.setState({
            class: event.target.value
        })
    }

    handleDisabledChange = (event) => {
        this.setState({
            disabled: event.target.value
        })
    }
    
    handleMarksChange = (event) => {
        this.setState({
            marks: event.target.value
        })
    }

    handleAttendanceChange = (event) => {
        this.setState({
            attendance: event.target.value
        })
    }

    handleIncomeBlur = event => {
        this.setState({
            incomeBlur: true
        })
    }

    handleMarksBlur = event => {
        this.setState({
            marksBlur: true
        })
    }

    handleAttendanceBlur = event => {
        this.setState({
            attendanceBlur: true
        })
    }

    onFileChange = event => {
        this.setState({
            csvFile: event.target.files[0]
        });
        
    }

    onPredictFileChange = event => {
        this.setState({
            predFile: event.target.files[0]
        });
        
    }

    checkModel = () => {
        axios.post('http://127.0.0.1:5000/checkModel', {
            key: "value"
         },
         {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(response => {
            response = response.data.uploadFile;
            if(response === "0") {
                response = false;
            } else {
                response = true;
            }
            this.setState({
                uploadFile: response
            })
        });
    }

    uploadFile = e => {
        e.preventDefault();
        console.log(this.state);
        const url = "http://127.0.00.1:5000/uploadData";

        const formData = new FormData();
        formData.append('dataCSV', this.state.csvFile);

        const headers = {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        };

        const options = {
            method: 'POST',
            url: url,
            data: formData,
            headers: headers
        };

        axios(options).then(response => {
            this.setState({
                uploadError: response.data.message
            })
        });
    }

    uploadPredFile = e => {
        e.preventDefault();
        const url = "http://127.0.00.1:5000/predictCSV";

        const formData = new FormData();
        formData.append('dataCSV', this.state.predFile);

        const headers = {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        };

        const options = {
            method: 'POST',
            url: url,
            data: formData,
            headers: headers
        };


        axios(options).then(response => {
            console.log(response);
            this.setState({
                predResults: response.data.result
            })
        });
    }

    predictDrop = e => {
        e.preventDefault();
        this.setState({
            prediction: 3
        })

        const url = "http://127.0.0.1:5000/predict"

        const data = {
            gender: this.state.gender,
            income: parseInt(this.state.income),
            caste: this.state.caste,
            attendance: parseInt(this.state.attendance),
            disabled: parseInt(this.state.disabled),
            class: parseInt(this.state.class),
            marks: parseInt(this.state.marks)
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        };

        const options = {
            method: 'POST',
            url: url,
            data: data,
            headers: headers
        };
        axios(options).then(response => {
            if(response.data.status === 200) {
                this.setState({
                    prediction: response.data.prediction[0]
                })
            } else {
                this.setState({
                    predError: response.data.message
                })
            }
        }).catch(err => {
            this.setState({
                predError: 'There was an error, please try again. Sorry'
            })
        })
    }

    componentDidMount = () => {
        this.checkModel()
    }

    render() {
        return(
            <div className="predictDiv">
                
                <div className="formDiv">
                    <span className="text-info">{this.props.loading ? "Loading..." : null}</span>                    
                    <span className="text-danger">{this.props.error}</span>  
                    <h3>Predict Dropout Possibility</h3>
                    <p>{this.state.uploadFile ? 'Upload Student Data From Last Year to Start Predicting Dropout Possibilities' : 'Enter student data to continue'}</p>
                    <p className="mt-3 mb-3">{this.state.uploadError ? <span className="text-info">{this.state.uploadError} (Reload Page To Predict)</span> : null}</p>
                    {this.state.uploadFile ? 
                        <form>
                            <div className="form-group">
                                <label>Upload CSV File</label><br />
                                <input type="file" name="file" id="exampleFile" accept=".csv" onChange={(e) => this.onFileChange(e)} />                     
                            </div>
                            <button onClick={this.uploadFile} className="btn btn-primary">Upload</button>
                        </form> 
                    :
                    <div>
                        <form>     
                            <br />             
                            <div className="form-group">
                                <label>Gender:</label>
                                <select required className="custom-select form-control" value={this.state.gender} onChange={this.handleGenderChange}>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                </select>                        
                            </div>
                            <div className="form-group">
                                <label>Income: (in thousands)</label>
                                <input type="number" className={this.state.income === "" && this.state.incomeBlur ? "is-invalid form-control" : this.state.incomeBlur ? "is-valid form-control" : "form-control"} id="pwd" placeholder="eg. 20" value={this.state.income} onChange={this.handleIncomeChange} onBlur={this.handleIncomeBlur} required />
                            </div>
                            <div className="form-group">
                                <label>Caste</label>
                                <select required className="custom-select form-control" value={this.state.caste} onChange={this.handleCasteChange}>
                                    <option value="gen">General</option>
                                    <option value="obc">OBC</option>
                                    <option value="sc">SC</option>
                                    <option value="st">ST</option>
                                </select>                             
                            </div>
                            <div className="form-group">
                                <label>Disabled: </label>
                                <select required className="custom-select form-control" value={this.state.disabled} onChange={this.handleDisabledChange}>
                                    <option value="0">No</option>
                                    <option value="1">Yes</option>
                                </select>                             
                            </div>
                            <div className="form-group">
                                <label>Class</label>
                                <select required className="custom-select form-control" value={this.state.class} onChange={this.handleClassChange}>
                                    <option value="4">4th</option>
                                    <option value="5">5th</option>
                                    <option value="6">6th</option>
                                    <option value="7">7th</option>
                                </select>                        
                            </div>
                            <div className="form-group">
                                <label>Marks: (out of 100)</label>
                                <input type="number" className={this.state.marks === "" && this.state.marksBlur ? "is-invalid form-control" : this.state.marksBlur ? "is-valid form-control" : "form-control"} id="pwd" placeholder="eg. 80" value={this.state.marks} onChange={this.handleMarksChange} onBlur={this.handleMarksBlur} required />                          
                            </div>
                            <div className="form-group">
                                <label>Attendance: (in %)</label>
                                <input type="number" className={this.state.attendance === "" && this.state.attendanceBlur ? "is-invalid form-control" : this.state.attendanceBlur ? "is-valid form-control" : "form-control"} id="pwd" placeholder="eg. 80" value={this.state.attendance} onChange={this.handleAttendanceChange} onBlur={this.handleAttendanceBlur} required />                          
                            </div>
                            <button className="btn btn-primary" onClick={this.predictDrop}>Predict</button>
                            <p className="mt-3 mb-3">{this.state.prediction !== null ? this.state.prediction===1 ? <span className="text-danger">The Student is likely to dropout</span> : this.state.prediction===0 ? <span className="text-success">The student won't dropout.</span> : <span className="text-info">Processing...</span> : null }</p>
                        </form>
                        <form className="mt-5">
                            <div className="form-group">
                                <label>Predict Using CSV File</label><br />
                                <input type="file" name="predictFile" id="exampleFile" accept=".csv" onChange={(e) => this.onPredictFileChange(e)} />                     
                            </div>
                            <button onClick={this.uploadPredFile} className="btn btn-primary">Upload</button>
                        </form>
                        <div className="tableDiv">
                            <table>
                                <tr className="mb-3">
                                    <th>Student Name</th>
                                    <th>Prediction</th>
                                </tr>
                                {this.state.predResults !== null ? Object.keys(this.state.predResults).map((value, key) => {
                                    return (
                                        <tr key={key}>
                                            <th>{value}</th>
                                            <th>{this.state.predResults[value] === "0" ? <span className="text-success">Probably won't dropout.</span> : <span className="text-danger">Probably will dropout</span>}</th>
                                        </tr>
                                    );
                                }) : null}
                            </table>
                        </div>
                    </div>
                    }
                </div>
            </div>
        );
    }
}

export default Predict;