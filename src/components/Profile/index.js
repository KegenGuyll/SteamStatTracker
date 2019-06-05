import React, { Component } from 'react';
import {
  Button,
  InputGroup,
  FormControl,
  Card,
  Container,
  Row,
  Col,
  Tab,
  Nav,
  Media,
  Badge,
  Spinner
} from 'react-bootstrap';
import axios from 'axios';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      steamid: '',
      userData: null,
      friends: null,
      friendsData: null,
      userGames: null,
      steamids: []
    };
  }

  handleSteamid = e => {
    this.setState({ steamid: e.target.value });
  };

  userGames = () => {
    if (this.state.userGames !== null) {
      return null;
    } else {
      const proxyurl = 'https://cors-anywhere.herokuapp.com/';
      const Endpoint =
        'https://api.steampowered.com/IPlayerService/GetOwnedGames/v1';
      const key = 'C327E2A0215F324BD9FA631D58AFC2C2';
      const EndpointQuery = `?key=${key}&steamid=${
        this.state.steamid
      }&include_appinfo=${1}&include_played_free_games=${0}`;

      axios
        .get(`${proxyurl}${Endpoint}${EndpointQuery}`, {
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        })
        .then(response => {
          this.setState({ userGames: response.data });
        })
        .catch(e => {
          console.log(e);
        });
    }
  };

  userFriends = () => {
    if (this.state.friends !== null) {
      return null;
    } else {
      const proxyurl = 'https://cors-anywhere.herokuapp.com/';
      const Endpoint =
        'https://api.steampowered.com/ISteamUser/GetFriendList/v1/';
      const key = 'C327E2A0215F324BD9FA631D58AFC2C2';
      const EndpointQuery = `?key=${key}&steamid=${this.state.steamid}`;
      axios
        .get(`${proxyurl}${Endpoint}${EndpointQuery}`, {
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        })
        .then(response => {
          this.setState({ friends: response.data });
        })
        .then(() => {
          this.state.friends.friendslist.friends.map(user => {
            this.state.steamids.push(user.steamid);
          });
        })
        .then(() => {
          this.userInformation(this.state.steamids.toString());
        })
        .catch(e => {
          console.log(e);
        });
    }
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
        if (response.data.response.players.length > 1) {
          this.setState({ userFriends: response.data.response });
        } else {
          this.setState({ userData: response.data.response }, this.userGames());
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  render() {
    return (
      <div>
        <InputGroup>
          <FormControl
            onChange={this.handleSteamid}
            placeholder='Steamid'
            aria-label='Steam id'
          />
          <InputGroup.Append>
            <Button
              disabled={this.state.steamid === ''}
              onClick={() => this.userInformation(this.state.steamid)}
            >
              Search
            </Button>
          </InputGroup.Append>
        </InputGroup>
        <br />
        {this.state.userData && (
          <Container>
            <Row>
              <Col lg={3} sm={3} md={3}>
                {this.state.userData.players.map(user => {
                  const date = new Date(user.lastlogoff * 1000);
                  return (
                    <Card style={{ width: '16rem' }} key={user.profileurl}>
                      <Card.Img variant='top' src={user.avatarfull} />
                      <Card.Body>
                        <Card.Title href={user.profileurl}>
                          {user.personaname}
                        </Card.Title>
                      </Card.Body>
                      <Card.Footer>
                        <small>{`Last Online ${date}`}</small>
                      </Card.Footer>
                    </Card>
                  );
                })}
              </Col>
              <Col>
                <Tab.Container defaultActiveKey='first'>
                  <Row>
                    <Col lg={3} sm={3} md={3}>
                      <Nav variant='pills'>
                        <Nav.Item>
                          {this.state.userGames ? (
                            <Nav.Link eventKey='first'>
                              Games
                              <Badge
                                style={{ marginLeft: '1vw' }}
                                variant='light'
                              >
                                {this.state.userGames.response.games.length}
                              </Badge>
                            </Nav.Link>
                          ) : (
                            <Nav.Link eventKey='first'>Games</Nav.Link>
                          )}
                        </Nav.Item>
                        <Nav.Item onClick={this.userFriends}>
                          {this.state.userFriends ? (
                            <Nav.Link eventKey='second'>
                              Friends List
                              <Badge
                                style={{ marginLeft: '1vw' }}
                                variant='light'
                              >
                                {this.state.userFriends.players.length}
                              </Badge>
                            </Nav.Link>
                          ) : (
                            <Nav.Link eventKey='second'>Friends List</Nav.Link>
                          )}
                        </Nav.Item>
                      </Nav>
                    </Col>
                    <Col
                      style={{ height: '500px', overflow: 'scroll' }}
                      lg={9}
                      sm={9}
                      md={9}
                    >
                      <Tab.Content>
                        <Tab.Pane eventKey='first'>
                          {this.state.userGames ? (
                            this.state.userGames.response.games.map(game => {
                              return (
                                <Media
                                  style={{
                                    paddingTop: '1vw',
                                    paddingBottom: '1vw'
                                  }}
                                  key={game.appid}
                                >
                                  <img
                                    width={64}
                                    height={64}
                                    alt='Game Icone'
                                    src={`http://media.steampowered.com/steamcommunity/public/images/apps/${
                                      game.appid
                                    }/${game.img_icon_url ||
                                      game.img_logo_url}.jpg`}
                                  />
                                  <Media.Body>
                                    <h5 style={{ paddingLeft: '1vw' }}>
                                      {game.name}
                                    </h5>
                                    <small style={{ paddingLeft: '1vw' }}>
                                      {`${Math.ceil(
                                        (10 * game.playtime_forever) / 60
                                      ) / 10} Hours`}
                                    </small>
                                  </Media.Body>
                                </Media>
                              );
                            })
                          ) : (
                            <Col>
                              <Spinner animation='border' variant='primary' />
                            </Col>
                          )}
                        </Tab.Pane>
                        <Tab.Pane eventKey='second'>
                          {this.state.userFriends ? (
                            this.state.userFriends.players.map(friend => {
                              return (
                                <Media
                                  style={{
                                    paddingTop: '1vw',
                                    paddingBottom: '1vw'
                                  }}
                                  key={friend.steamid}
                                >
                                  <img
                                    width={64}
                                    height={64}
                                    alt='Avatar'
                                    src={friend.avatarmedium}
                                  />
                                  <Media.Body>
                                    <h5 style={{ paddingLeft: '1vw' }}>
                                      {friend.personaname}
                                    </h5>
                                    <small style={{ paddingLeft: '1vw' }}>
                                      {friend.realname}
                                    </small>
                                  </Media.Body>
                                </Media>
                              );
                            })
                          ) : (
                            <Col>
                              <Spinner animation='border' variant='primary' />
                            </Col>
                          )}
                        </Tab.Pane>
                      </Tab.Content>
                    </Col>
                  </Row>
                </Tab.Container>
              </Col>
            </Row>
          </Container>
        )}
      </div>
    );
  }
}

export default Profile;
