import React from "react";
import {Button, Icon} from "semantic-ui-react";

export default function ErrorNotice(props) {
    return (
        <div className="error-notice" style={{marginBottom:"1rem"}}>
            <span style={{color:"darkblue"}}>{props.message}</span>
            <Button icon size='mini' wrapped style={{padding: 5, marginLeft:"1rem"}} onClick={props.clearError}>
                <Icon name='close' />
            </Button>
        </div>
    );
}