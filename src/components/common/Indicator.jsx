import {Component, PropTypes} from 'react'
// import { Grid } from 'semantic-ui-react'

export default class Indicator extends Component {

    render() {
        return (
            <div className='indicator'>
                 <span className='indicator-value'>
                    {this.props.value}
                </span>
                <span className='indicator-title'>
                    <div>
                    {this.props.name}
                    </div>
                </span>

            </div>

        )

    }
}

Indicator.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired
};
