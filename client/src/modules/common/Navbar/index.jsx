import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { signOut } from '../../../redux/actions/auth';
import { makeRequest, checkUserRequest } from '../../../redux/actions/requests';
import { warningMessage, successMessage } from '../../../toasts';
import errorFormatter from '../../../utils/errorFormatter.json';
import { clearRequestState } from '../../../redux/actions';

export class Navbar extends Component {
  static propTypes = {
    signOut: PropTypes.func.isRequired,
    makeRequest: PropTypes.func.isRequired,
    clearRequestState: PropTypes.func.isRequired,
    checkUserRequest: PropTypes.func.isRequired,
    auth: PropTypes.shape({
      name: PropTypes.string
    }).isRequired,
    requestsReducer: PropTypes.shape({
      error: PropTypes.string,
      request: PropTypes.object,
      success: PropTypes.bool,
      hasRequest: PropTypes.bool
    }).isRequired,
    handleSubmit: PropTypes.func,
    switchContent: PropTypes.func,
    showTabs: PropTypes.bool,
    showIcon: PropTypes.bool,
    gotoHome: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
      showSearchBar: false,
      name: '',
      timeout: 0,
      noOfRequests: 5
    };
    this.toggleState = this.toggleState.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.signOut = this.signOut.bind(this);
    this.handleAdminRequest = this.handleAdminRequest.bind(this);
    this.instantSearch = this.instantSearch.bind(this);
  }
  componentDidMount = () => {
    if (this.props.auth) {
      this.setState(() => ({ name: this.props.auth.name }));
    }
    const userId = localStorage.getItem("userId");
    this.props.checkUserRequest(userId, 'admin_request');
  };

  componentDidUpdate(prevProps) {
    const { requestsReducer: { error, success } } = this.props;
    if (error && !success) {
      warningMessage(errorFormatter[error]);
      this.props.clearRequestState();
    }
    if (success) {
      successMessage('Request Sent');
      this.props.clearRequestState();
    }
  }

  handleSearch(event) {
    event.preventDefault();
    this.props.handleSubmit(event);
    this.setState({
      showSearchBar: false
    });
  }

  instantSearch(event) {
    event.preventDefault();
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.props.handleSubmit(event);
    }, 500);
    this.props.handleInput(event);
  }

  signOut(event) {
    event.preventDefault();
    this.props.signOut();
  }

  handleAdminRequest(event) {
    event.preventDefault();
    this.props.makeRequest({ type: 'admin_request' });
  }

  toggleState(state) {
    this.setState(prevState => ({
      [state]: !prevState[state]
    }));
    if (state === 'showSearchBar') {
      setTimeout(() => {
        document.getElementById('search').focus();
      }, 100);
    }
  }

  render() {
    const { showSearchBar, name } = this.state;
    const { requestsReducer: { hasRequest } } = this.props;
    const role = localStorage.getItem("role");
    const {
      showTabs, switchContent, showIcon, gotoHome
    } = this.props;
    const searchBar = showSearchBar ? 'show' : 'hide';
    const mainNav = showSearchBar ? 'hide' : 'show';
    const extendNavbar = showTabs ? 'nav-extended ' : '';
    const disableClass = hasRequest ? 'disabledButton' : '';
    return (
      <div className="navbar-fixed">
        <nav className={`nav-white ${extendNavbar} ${mainNav}`}>
          <div className="nav-wrapper">
            <a
              href="#!"
              data-target="main-navigation"
              className="sidenav-trigger"
            >
              <i className="material-icons">menu</i>
            </a>

            <NavLink to="/teams" className="brand" onClick={gotoHome}>
              Andela Teams
            </NavLink>
            {showIcon && (
              <a
                id="showSearchBar"
                href="#!"
                onClick={() => this.toggleState('showSearchBar')}
                className=" float-right sidenav-trigger"
              >
                <i className="material-icons">search</i>
              </a>
            )}
            <ul className="right hide-on-med-and-down nav-items">
              {this.props.showIcon && (
                <li>
                  <a
                    id="showSearchBar2"
                    href="#!"
                    onClick={() => this.toggleState('showSearchBar')}
                  >
                    <i className="material-icons" data-tip="search teams">
                      search
                    </i>
                  </a>
                </li>
              )}
              {
                role === 'admin' ?
                  <li>
                    <NavLink to="/teams/create">
                      {/* Create team */}
                      <i className="material-icons" data-tip="Create teams">
                        group_add
                      </i>
                    </NavLink>
                  </li> :
                  <li>
                    <button
                      className={`admin-request-btn ${disableClass}`}
                      onClick={this.handleAdminRequest}
                      disabled={hasRequest}
                    >
                      <i
                        className="tiny material-icons"
                        data-tip="Only LFs can make this request">
                        info
                      </i>
                      Request admin privilege
                    </button>
                  </li>
              }
              <li>
                <NavLink to="/teams" onClick={this.props.gotoHome}>
                  {/* Teams */}
                  <i className="material-icons" data-tip="Teams">
                    group
                  </i>
                </NavLink>
              </li>
              <li>
                <NavLink to="/teams/favorites">
                  {/* Favorite teams */}
                  <i className="material-icons" data-tip="favorite teams">
                    favorite
                  </i>
                </NavLink>
              </li>
              <li className="notif-container">
                <NavLink to="/requests/admin">
                  {/* Notifications */}
                  <span className="badge notif-badge">{this.state.noOfRequests}</span>
                  <i className="material-icons" data-tip="notifications">
                    notifications_active
                  </i>
                </NavLink>
              </li>
              <li>
                <a
                  className="dropdown-trigger"
                  href="#!"
                  data-target="dropdown-menu-main"
                  data-beloworigin="true"
                >
                  <i className="material-icons right">
                    account_circle arrow_drop_down
                  </i>
                  {/* <i className="material-icons left" data-tip="notifications">
                    account_circle
                  </i> */}
                  {/* <span>{name}</span> */}
                </a>
              </li>
            </ul>
          </div>
          {showTabs && (
            <div className="nav-content">
              <ul className="tabs tabs-transparent">
                <li className="tab">
                  <a
                    className="projects"
                    href="#Projects"
                    onClick={event => switchContent(event, 'project')}
                  >
                    Projects
                  </a>
                </li>
                <li className="tab">
                  <a
                    className="members"
                    href="#members"
                    onClick={event => switchContent(event, 'member')}
                  >
                    Members
                  </a>
                </li>
                <li className="tab">
                  <a
                    className="account"
                    href="#account"
                    onClick={event => switchContent(event, 'account')}
                  >
                    Account
                  </a>
                </li>
              </ul>
            </div>
          )}
        </nav>
        <nav className={`nav-blue navbar-fixed ${searchBar}`}>
          <div className="nav-wrapper">
            <form onSubmit={this.handleSearch}>
              <div className="input-field">
                <input
                  id="search"
                  type="search"
                  required
                  value={this.props.searchValue}
                  onChange={this.instantSearch}
                />
                <label className="label-icon" htmlFor="search">
                  <i className="material-icons">search</i>
                </label>
                {/* eslint-disable-next-line */}
                <i
                  id="showSearchBar3"
                  className="material-icons"
                  onClick={() => this.toggleState('showSearchBar')}
                >
                  close
                </i>
              </div>
            </form>
          </div>
        </nav>
        <ul id="dropdown-menu-main" className="dropdown-content">
          <li>
            <a href="#!">Profile</a>
          </li>
          <li className="divider" />
          <li>
            <a href="#!" onClick={this.signOut}>
              Sign Out
            </a>
          </li>
        </ul>
        <ul id="dropdown-menu" className="dropdown-content">
          <li>
            <a href="#!">Profile</a>
          </li>
          <li className="divider" />
          <li>
            <a href="#!" onClick={this.signOut}>
              Sign Out
            </a>
          </li>
        </ul>
        <ul className="sidenav" id="main-navigation">
          <li>
            <NavLink to="/teams">Teams</NavLink>
          </li>
          <li>
            <NavLink to="/teams/favorites">Favorite teams</NavLink>
          </li>
          <li>
            <NavLink to="/teams/create">Create Team</NavLink>
          </li>
          <li>
            <a
              className="dropdown-trigger"
              href="#!"
              data-target="dropdown-menu"
            >
              <i className="small material-icons left">
                account_circle arrow_drop_down
              </i>
            </a>
          </li>
        </ul>
        <ReactTooltip />
      </div>
    );
  }
}

const mapStateToProps = ({ auth, requestsReducer }) => ({
  auth,
  requestsReducer
});

export default connect(mapStateToProps, {
  signOut, makeRequest, clearRequestState, checkUserRequest
})(Navbar);
