import React, {Component} from 'react'

import {Dimmer, Loader} from 'semantic-ui-react'

export default class SemanticLoader extends Component {
    render() {
        return <Dimmer className='custom' active={this.props.isDataLoading} inverted>
            <Loader size='large'>Завантаження</Loader>
        </Dimmer>
    }
}
