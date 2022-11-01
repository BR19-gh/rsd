# RSD رصد (Recording Students Degrees) System

  

## Overview

  

A full-stack Recording Students Degrees System that ..., The store uses Flask as its backend, PostgreSQL as database, and CSS, HTML, JS/TS and Bootstrap as its Frontend
  

The application is deployed on Heroku and can be accessed at <br> [RSD-br19.herokuapp.com](https://RSD-br19.herokuapp.com)

  

## Running the Project Locally

  

### Project Dependencies

<hr>

  

  

#### Python 3.9.10

  

  

  

Install Here: [python docs](https://docs.python.org/3/using/unix.html#getting-and-installing-the-latest-version-of-python)

<hr>

  

  

#### Virtual Environment

  

  

*  **virtualenv** as a tool to create isolated Python environments

  

  

* It is recommended to work with a virtual environment whenever using Python for projects. This keeps your dependencies for each project separate and organized.

  

  

* Instructions for setting up a virtual environment for your platform can be found in the [python docs](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/)

<hr>

  

  

#### Installing Dependencies

  

Once you have your virtual environment setup and running, install dependencies by running:

  


```bash
pip install -r requirements.tx
```

  

This will install all the required packages as mentioned within the `requirements.txt` file.

  

#### Key Dependencies

 
-  [Flask](http://flask.pocoo.org/) is a lightweight backend microservices framework. Flask is required to handle requests and responses.

  


-  [Flask-CORS](https://flask-cors.readthedocs.io/en/latest/#) is the extension to use for handling cross-origin requests from our frontend server when running the project locally.

   - after installing this dependency, uncomment the following line in `app/main.py` for the app to work locally:

``` python
# cors = CORS(app)
```

<hr>

  

### Database Setup

* SQLite is the database for local running and `spdb.db` is the database file

* PostgreSQL is the database for production environment, because of that, you have to comment out this line of code in all of `app/main.py`:

``` python
self.conn = psycopg2.connect(DATABASE_URL, sslmode='require')
```

and uncomment the following line in all `of app/main.py`:

``` python
# self.conn = sqlite3.connect("spdb.db")
```

for database connections to work locally
  

### Environment variables
  

* Create `.env` file in the root directory and put the following values in:

```
USERNAME = xxxx

PASSWORD = xxxx
```

  

### Running the server



* From within the project directory first ensure you are working using your created virtual environment, then type the following:

```bash
flask run
```

or in PowerShell for Windows

```powershell
$env:FLASK_APP  =  "app/main.py"

$env:FLASK_ENV  =  "development"

flask run
```

  
  

## API Reference

  

  

### Getting Started

  

  
  

  

  

### <div id="Error">Error Handling and Status Codes</div>

  

  

The API will return the following error codes and status codes

when requests fail or success:

  

- 200: Entity is Updated

  

- 201: Entity is Created

  

- 202: Accepted for Processing

  

- 204: Deleted Successfully or No Content to Return

  

- 400: Bad Request

  
  

- 401: Unauthorized Access

  
  

- 403: Entity Exists

  

- 404: Resource Not Found

  

  

- 405: Method Used Not Allowed

  
  

- 429: Rate-Limit of Requests Exceeded

  
  

- 500: Internal Server Error

  
  

- 503: Server is Down Due to Maintenance

  

  


  

### API Endpoints

  
  


## Frontend



## Updates

