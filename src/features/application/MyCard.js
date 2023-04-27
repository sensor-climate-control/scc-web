import Card from 'react-bootstrap/Card';

const MyCard = props => {
    const styling = (props.style) ? props.style : { width: '18rem', backgroundColor: '#646c7a' }
    return (
        <Card style={styling}>
            <Card.Body>
                <Card.Title>{props.title}</Card.Title>
                {props.children}
            </Card.Body>
        </Card>
    )
}

export default MyCard;
