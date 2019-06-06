import React, { Component } from 'react';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  CardGroup,
  ListGroup,
  Button
} from 'react-bootstrap';

class Compare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      steamid: '',
      players: null,
      playersGames: []
    };
  }

  componentDidMount = () => {
    const {
      match: { params }
    } = this.props;
    if (params.steamid) {
      this.userInformation(params.steamid);
    }
  };

  requestGames = async steamid => {
    this.userGameInformation(steamid);
  };

  timeSort = (a, b) => {
    const TimeA = a.playtime_forever;
    const TimeB = b.playtime_forever;

    let comparison = 0;
    if (TimeA > TimeB) {
      comparison = -1;
    } else if (TimeA < TimeB) {
      comparison = 1;
    }
    return comparison;
  };

  userGameInformation = steamid => {
    const proxyurl = 'https://cors-anywhere.herokuapp.com/';
    const Endpoint =
      'https://api.steampowered.com/IPlayerService/GetOwnedGames/v1';
    const key = 'C327E2A0215F324BD9FA631D58AFC2C2';
    const EndpointQuery = `?key=${key}&steamid=${steamid}&include_appinfo=${1}`;

    axios
      .get(`${proxyurl}${Endpoint}${EndpointQuery}`, {
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
      .then(response => {
        this.state.playersGames.push({
          user: response.data.response.games.sort(this.timeSort)
        });
      })

      .catch(e => {
        console.log(e);
      });
  };

  userInformation = steamids => {
    const proxyurl = 'https://cors-anywhere.herokuapp.com/';
    const Endpoint =
      'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/';
    const key = 'C327E2A0215F324BD9FA631D58AFC2C2';
    const EndpointQuery = `?key=${key}&steamids=${steamids}`;
    axios
      .get(`${proxyurl}${Endpoint}${EndpointQuery}`, {
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
      .then(response => {
        console.log(response.data.response.players);
        this.setState({ players: response.data.response.players });
      })
      .then(() => {
        this.state.players.map(user => {
          console.log('game data');
          this.requestGames(user.steamid);
        });
      })
      .catch(e => {
        console.log(e);
      });
  };

  render() {
    return (
      <div>
        {console.log(this.state.playersGames)}
        <Container fluid>
          <Row className='justify-content-md-center'>
            <CardGroup>
              {this.state.players ? (
                this.state.players.map(user => {
                  return (
                    <Col key={user.steamid}>
                      <Card>
                        <Card.Img variant='top' src={user.avatarfull} />
                        <Card.Body>
                          <Card.Title>{user.personaname}</Card.Title>
                          <small>{`SteamId: ${user.steamid}`}</small>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })
              ) : (
                <Spinner animation='border' variant='primary' />
              )}
            </CardGroup>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Compare;
