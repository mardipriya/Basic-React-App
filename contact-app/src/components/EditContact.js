import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
function withRouter(Component) {
    return function Wrapped(props) {
      const navigate = useNavigate();
      const location = useLocation();
      //const params   = useParams();
      return (
        <Component
          {...props}
          navigate={navigate}
          location={location}
          //params={params}
        />
      );
    };
  }
  class EditContact extends React.Component {
    constructor(props) {
      super(props);
      // pull contact data out of the location prop we injected
      const { id, name, email } = props.location.state.contact;
      this.state = { id, name, email };
    }
  
    update = (e) => {
      e.preventDefault();
      const { name, email } = this.state;
      if (!name.trim() || !email.trim()) {
        alert("All the fields are mandatory");
        return;
      }
      this.props.updateContactHandler( this.state );
      this.setState({name: "",email: ""});
      this.props.navigate("/");
    };
  
    render() {
        return (
            <div className="ui main container"  style={{ marginTop: "70px"}} >
                <div className="ui container center">
                      <h2>Edit Contact</h2>
                </div>
                <form className="ui form" onSubmit={this.update}>
                    <div className="field">
                        <label>Name</label>
                        <input type="text" name="name" placeholder="Name" value={this.state.name} onChange={(e)=> this.setState({name:e.target.value})}/>    
                    </div>
                    <div className="field">
                        <label>Email</label>
                        <input type="text" name="email" placeholder="Email" value={this.state.email} onChange={(e)=>this.setState({email:e.target.value})}/>    
                    </div>
                    <button className="ui button blue">Update</button>
                </form>
            </div>
        );
    }
  }
  
  export default withRouter(EditContact);
  