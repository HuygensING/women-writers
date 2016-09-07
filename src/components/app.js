import React from "react";
import { Link } from "react-router";
import { urls } from "../router";
import cx from "classnames";
import { Login, Federated, Basic } from "hire-login";
import config from "../config";
import Messages from "./messages";

class App extends React.Component {


	render() {
		const { location: { pathname }, user } = this.props;

		const loggedIn = user && user.token;
		const authorsIsActive = pathname.match(/^\/womenwriters\/vre\/persons/);
		const collectivesIsActive = pathname.match(/^\/womenwriters\/vre\/collectives/);
		const publicationsIsActive = pathname.match(/^\/womenwriters\/vre\/documents/);
		const receptionsIsActive = pathname.match(/receptions\/(authors|publications)\/?/);
		const authorReceptionsIsActive = pathname === urls.authorReceptionSearch(true);
		const publicationReceptionsIsActive = pathname === urls.publicationReceptionSearch(true);
		const modifiedIsActive = pathname === urls.modifiedSearch();

		const receptionToggle = authorReceptionsIsActive || publicationReceptionsIsActive ? (
			<div className="btn-group" style={{marginLeft: "30px", marginBottom: "15px"}}>
				<Link className={cx("btn", "btn-default", {active: authorReceptionsIsActive})} to={urls.authorReceptionSearch()}>Authors</Link>
				<Link className={cx("btn", "btn-default", {active: publicationReceptionsIsActive})} to={urls.publicationReceptionSearch()}>Publications</Link>
			</div>) : null;

		const receptionLink = receptionsIsActive ?
			<Link to={pathname}>Receptions</Link> :
			<Link to={urls.publicationReceptionSearch()}>Receptions</Link>;

		const newAuthorButton = loggedIn ? <button className="btn btn-default" onClick={this.props.onNewAuthor}>New author</button> : null;
		const newPublicationButton = loggedIn ? <button className="btn btn-default" onClick={this.props.onNewPublication}>New publication</button> : null;
		const newCollectiveButton = loggedIn ? <button className="btn btn-default" onClick={this.props.onNewCollective}>New collective</button> : null;

		return (
			<div>
				<div style={{backgroundColor: "#009688", padding: "20px", height: "100px"}}>
					<h1 style={{color: "white", margin: 0, width: "calc(100% - 420px)", display: "inline-block"}}>
						<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAkBAMAAABLURayAAAAA3NCSVQICAjb4U/gAAAAMFBMVEX///////////////////////////////////////////////////////////////9Or7hAAAAAEHRSTlMAESIzRFVmd4iZqrvM3e7/dpUBFQAAAAlwSFlzAAALEgAACxIB0t1+/AAAABV0RVh0Q3JlYXRpb24gVGltZQAxMi8zLzE1mSRSyAAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAADZSURBVBiVJc89bsJAFATgsSJMIL99JIsLoFyBG6RO5dwgR3BDnbigSQXiAkhcgChVlBSbOo05AZaVGAz+GeaZlXa/3Vmt3ltAo7t5MjzHzBySuR0Tbgp5SbqDnJKrEuiQjRmQh3QPvJIFP+DR/Ma5/GKNa/kiQ/nMxl5TeziyimRKzh8kuUO3NYaXNkjrW5Wq4bYqGVaYWkv3JcIfeVMgWJs5en+WZzhTC4hmwGIAJCNl7+hUyvw9gn/7ziJ2sdlf/6Idy9HJcbv6b5+PE3nBMira5O50jSvNIxcieD2pu/pyAAAAAElFTkSuQmCC" />
						<span style={{position: "relative", top: "6px", left: "8px"}}>NEWW Women Writers</span>
					</h1>

					<div style={{display: "inline-block", width: "420px"}}>
						<Login
							appId="WomenWriters"
							headers={{VRE_ID: "WomenWriters"}}
							onChange={(this.props.onLoginChange)}
							userUrl={config.userUrl}>
							<Federated url={config.federatedAuthenticateUrl} />
							<Basic url={config.basicAuthenticateUrl} />
						</Login>
						<div className="btn-group">
							{newAuthorButton}
							{newPublicationButton}
							{newCollectiveButton}
						</div>
					</div>
				</div>
				<header>
					<nav className="navbar navbar-default">
						<ul className="nav navbar-nav">
							<li>
								<a href="/womenwriters">
									Home
								</a>
							</li>
							<li className={cx({active: authorsIsActive})}>
								<Link to={urls.authorSearch()}>Authors</Link>
							</li>
							<li className={cx({active: publicationsIsActive})}>
								<Link to={urls.publicationSearch()}>Publications</Link>
							</li>
							<li className={cx({active: receptionsIsActive})}>
								{receptionLink}
							</li>
							{ loggedIn ? (
								<li className={cx({active: collectivesIsActive})}>
									<Link to={urls.collectiveSearch()}>Collectives</Link>
								</li>
								) : null
							}
							<li>
								<a href="/womenwriters/?page_id=8">
									About this project
								</a>
							</li>
							<li>
								<a href="/womenwriters/?page_id=10">
									Getting started
								</a>
							</li>
							{ loggedIn ? (
								<li className={cx({active: modifiedIsActive})}>
									<Link to={urls.modifiedSearch()}>Last modifications</Link>
								</li>
								) : null
							}
						</ul>
					</nav>
				</header>
				<Messages types={["SUCCESS_MESSAGE", "ERROR_MESSAGE"]} messages={this.props.messages} onDismissMessage={this.props.onDismissMessage} />
				<main>
					{receptionToggle}
					{this.props.children}
				</main>
			</div>
		);
	}
}

export default App;
