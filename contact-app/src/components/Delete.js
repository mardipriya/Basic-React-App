import React from "react";
import { Link, useLocation } from "react-router-dom";

const Delete = (props) => {
  const { state } = useLocation();
  const { id, name, email } = state.contact;

  return (
    <>
      {/* Fixed header */}
      <div className="ui fixed menu">
        <div className="ui container center aligned">
          <h2>Delete Contact</h2>
        </div>
      </div>

      {/* Main content, pushed below the fixed menu */}
      <div className="ui main container" style={{ marginTop: "80px" }}>
        <div className="ui segment">
          <p>
            Are you sure you want to delete the contact{" "}
            <strong>{name}</strong> ({email})?
          </p>

          {/* Button group */}
          
          <div
            className="ui two buttons"
            style={{
                margin: "20px auto",
                display: "flex",
                justifyContent: "center"
            }}
            >
            <Link to="/">
                <button
                className="ui red basic button"
                onClick={() => props.removeContactHandler(id)}
                >
                Yes, Delete
                </button>
                <button className="ui grey basic button">Cancel</button>
            </Link>
            </div>

        </div>
      </div>
    </>
  );
};

export default Delete;
