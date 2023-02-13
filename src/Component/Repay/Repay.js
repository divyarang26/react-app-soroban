import React from 'react'

export default function 
() {
  return (
    <div>
        <div className="card">
                <header className='card-header'>

                    Repay

                </header>
                <form className="card-form"  >
                    <div className="input">
                        <input type="text" className="input-field" />
                        <label className="input-label">Amount</label>
                    </div>
                    <div className="input">
                        <input type="text" className="input-field"  />
                        <label className="input-label">Vault id</label>
                    </div>
                    


                    <div className="action">
                        <button className="action-button"
                        // onClick={(e)=>{
                        //     e.preventDefault()
                        //     console.log("to", to );
                        //     console.log("param", param )   
                        // }}
                        >Deposit</button>
                    </div>
                </form>

            </div>
    </div>
  )
}
