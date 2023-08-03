import React, { useState, useEffect } from 'react'
import styled from 'styled-components'


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  return (
    <Container>
        <div className="box">
            <div className="heading">Login</div>
            <input type="text" className="input" placeholder='Email Address or Mobile Number' value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="text" className="input" placeholder='Email Address or Mobile Number' value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
    </Container>
  )
}

export default Login

const Container = styled.div`
    height: 100vh;
    width: 100vw;
    background-color: whitesmoke;

    .heading{
        font-size: 1.5rem;
        margin-bottom: 10px;
        
    }

    .box{
        height: 500px;
        width: 400px;
        /* background-color: black; */

        position: fixed;
        top: calc(50vh - 250px);
        left: calc(50vw - 200px);

        border-radius: 20px;
        border: 1px solid #ccc1c1;
        background-color: white;

        padding: 10px;

        .input{
            width: 100%;
            margin: 5px 0;

            padding: 10px 20px;
            border-radius: 5px;
        }

        .btn{
            
        }
    }
`   