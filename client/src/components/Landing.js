import '../style.css'

const Landing = () => {
    return (
        <div style={{textAlign: 'center'}}>
            <h1>
                Survey Creator
            </h1>

            <div className="cards">
                <div className="card-one">
                    <div className="image-container-one">
                        <img src={process.env.PUBLIC_URL+"/images/Screen Shot 2022-10-12 at 10.06.51 AM.png"} alt="MassEmails"/>
                    </div>
                    <div className="text-container">
                        <h6>Send mass of emails with any provider to your costumers.</h6>
                    </div>
                </div>
                <div className="card-two">
                    <div className="image-container-two">
                        <img src={process.env.PUBLIC_URL+"/images/Screen Shot 2022-10-12 at 10.12.03 AM.png"} alt="MassEmails"/>
                    </div>
                    <h6>Personalize your messages and receive the feedback you need.</h6>
                </div>
           </div>
        </div>
    )
}
export default Landing;