import {Component, PropTypes} from 'react'
import {Grid, List, Header} from 'semantic-ui-react'

export default class TenderTable extends Component {

    render() {
        if (_.isNull(this.props.data)) {
            return null
        } else {
            let indicatorGroups = _.groupBy(this.props.data, function (item) {
                return item.risk;
            })
            return (<Grid.Column width={4}>
                    <Grid>
                        {Object.keys(indicatorGroups).map((key) => {
                            return (
                                <Grid.Row>
                                    <Grid.Column>
                                        <Header className={_.isEqual(parseInt(key), 0) ? 'positive' : 'negative'}>
                                            { _.isEqual(parseInt(key), 0) ? 'No Risk' : 'Risk'}
                                        </Header>
                                        <List divided relaxed link>
                                            {indicatorGroups[key].map((indicator) => {
                                                return <List.Item> {indicator.indicatorId} </List.Item>
                                            })}
                                        </List>
                                    </Grid.Column>
                                </Grid.Row>
                            )
                        })}
                    </Grid>
                </Grid.Column>
            )
        }

    }
}

TenderTable.propTypes = {
    data: PropTypes.array,
    selectedTender: PropTypes.number
};
