import {Component, PropTypes} from 'react'
import {Table, Menu, Icon, Grid, Segment, Popup} from 'semantic-ui-react'
import SemanticLoader from 'components/common/Loader';
import {PROCUREMENT_METHOD_TYPES_NAMES} from 'constants/Translations'


export default class TendersTable extends Component {

    PROZORRO_URL = 'https://dozorro.org/tender/';

    onPageIncrease() {
        if (!_.isEqual(this.props.currentPage, this.props.maxPage)) {
            this.props.onPageChange(this.props.currentPage + 1)
        }
    }

    onPageDecrease() {
        if (!_.isEqual(this.props.currentPage, 1)) {
            this.props.onPageChange(this.props.currentPage - 1)
        }
    }

    onBuyerSelect(buyerId) {
        window.location = '/buyer/' + buyerId
    }


    render() {
        let {data, currentPage,  selectedTender, selectedTenderIndicators} = this.props;

        let self = this;
        return _.isNull(data) ? <Grid><SemanticLoader isDataLoading={true}/></Grid> : (
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <Segment className={'no-border'}>
                            <Table celled fixed selectable singleLine className={'tenders-table'} textAlign='center'>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Id тендера</Table.HeaderCell>
                                        <Table.HeaderCell>Очікувана вартість</Table.HeaderCell>
                                        <Table.HeaderCell>Кількість індикаторів</Table.HeaderCell>
                                        <Table.HeaderCell>Сума індикаторів </Table.HeaderCell>
                                        <Table.HeaderCell>Замовник</Table.HeaderCell>
                                        <Table.HeaderCell>Регіон</Table.HeaderCell>
                                        <Table.HeaderCell>Тип процедури</Table.HeaderCell>
                                        <Table.HeaderCell>CPV</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                {data.map((tender) => {
                                    return (
                                        <Table.Body key={'indicator' + tender.id}>
                                            <Table.Row key='empty'></Table.Row>
                                            <Table.Row className='tender-row' key={tender.id + tender.id}
                                                       onClick={this.props.onTenderSelect.bind(this, tender.id)}>
                                                <Table.Cell key={tender.id + 'link'}><a target='_blank'
                                                                                        href={self.PROZORRO_URL + tender.tenderId}>{tender.tenderId}</a></Table.Cell>
                                                <Table.Cell key={tender.id + 'amount'}>
                                                    {parseFloat(tender.amount).toLocaleString('ru-RU')}
                                                </Table.Cell>
                                                <Table.Cell
                                                    key={tender.id + 'riskCount'}>{tender.risksCount}</Table.Cell>
                                                <Table.Cell key={tender.id + 'riskSum'}>{tender.risksSum}</Table.Cell>
                                                <Popup
                                                    trigger={<Table.Cell className='buyer' key={tender.id + 'buyer'}
                                                                         onClick={this.onBuyerSelect.bind(this, tender.buyerId)}>{tender.buyerName}</Table.Cell>}
                                                    content={tender.buyerName}
                                                />

                                                <Table.Cell key={tender.id + 'region'}>{tender.region}</Table.Cell>
                                                <Table.Cell key={tender.id + 'procurementMethodType'}>
                                                    {PROCUREMENT_METHOD_TYPES_NAMES[tender.procurementMethodType]}
                                                </Table.Cell>
                                                <Table.Cell key={tender.id + 'cpv'}>{tender.cpv}</Table.Cell>
                                            </Table.Row>
                                            {_.isEqual(tender.id, selectedTender) && !_.isNull(selectedTenderIndicators) &&
                                            <Table.Row key='empty2'>
                                                <Table.Cell key='icon'>
                                                    <Icon rotated='clockwise' name='level up' size='big'/>
                                                </Table.Cell>
                                                <Table.Cell key='indicator-risk' className='table-subheader'>Наявність
                                                    ризику</Table.Cell>
                                                <Table.Cell key='indicator-name' textAlign='left'
                                                            className='table-subheader' colSpan={5}>Назва
                                                    індикатора</Table.Cell>

                                                <Table.Cell key='indicator-risklots' className='table-subheader'>Лотів з
                                                    ризиком</Table.Cell>
                                            </Table.Row>
                                            }

                                            {_.isEqual(tender.id, selectedTender) && !_.isNull(selectedTenderIndicators) &&
                                            selectedTenderIndicators.map((indicator, index) => {
                                                return <Table.Row
                                                    negative={_.isEqual(parseInt(indicator.risk), 1)}>
                                                    {index == 0 ?
                                                        <Table.Cell
                                                            className='inner-table-first'
                                                            rowSpan={selectedTenderIndicators.length}></Table.Cell> : null}
                                                    <Table.Cell>{indicator.risk == '1' ?
                                                        <Icon color='red' name='checkmark'
                                                              size='small'/> : <Icon color='green' name='minus'
                                                                                     size='small'/>}</Table.Cell>
                                                    <Table.Cell
                                                        textAlign='left'
                                                        colSpan={5}>{indicator.indicatorId + '.' + indicator.indicatorDescription}</Table.Cell>

                                                    <Table.Cell>{indicator.lotsWithRisk}</Table.Cell>
                                                </Table.Row>
                                            })
                                            }
                                        </Table.Body>
                                    )
                                })}

                                <Table.Footer>
                                    <Table.Row>
                                        <Table.HeaderCell colSpan='8'>
                                            {(this.props.maxPage != 0) && <Menu floated='right' pagination>
                                                <Menu.Item as='a' icon onClick={self.onPageDecrease.bind(self)}>
                                                    <Icon name='left chevron'/>
                                                </Menu.Item>
                                                <Menu.Item >
                                                    {currentPage}/{this.props.maxPage}
                                                </Menu.Item>
                                                <Menu.Item as='a' icon onClick={self.onPageIncrease.bind(self)}>
                                                    <Icon name='right chevron'/>
                                                </Menu.Item>
                                            </Menu> }
                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Footer>

                            </Table>
                        </Segment>


                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

TendersTable.propTypes = {
    header: PropTypes.array.isRequired,
    data: PropTypes.array,
    maxPage: PropTypes.number,
    onTenderSelect: PropTypes.func.isRequired,
    currentPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    isDataLoading: PropTypes.bool.isRequired,
    selectedTender: PropTypes.number,
    selectedTenderIndicators: PropTypes.array
};
