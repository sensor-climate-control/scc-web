import Card from 'react-bootstrap/Card';

const MyCard = props => {
    return (
        <Card style={{ width: '18rem', backgroundColor: '#646c7a' }}>
            <Card.Body>
                <Card.Title>{props.title}</Card.Title>
                {props.children}
            </Card.Body>
        </Card>
    )
}

export default MyCard;