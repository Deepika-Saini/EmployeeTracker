import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import DATA from "./data";
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import logo from './logo.svg';

// Styling the tooltip
const ChairTooltip = withStyles((theme) => ({
  arrow:{
    color: theme.palette.common.white,
    "&:before": {
      border: "1px solid #666"
    },
    fontSize: 15,
  },
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    border: "1px solid #666",
    boxShadow: theme.shadows[1],
    fontSize: 10,
    padding: 9,
  },
}))(Tooltip);

// Topmost component, containing all the other components
class EmployeeTrackerApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: ''
    };
    
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(searchText) {
    this.setState({
      searchText: searchText
    });
  }
  
  render() {
    return (
      <div className="app-area">  
        <SearchBar
          searchText={this.state.searchText}
          onSearch={this.handleSearch}/>
        <OfficeArea
          searchText={this.state.searchText}
          appData={this.props.appData}
        />
      </div>
    );
  }
}

// The following component is for handling the searchbar
class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
  }
  
  handleSearch(e) {
    this.props.onSearch(e.target.value);
  }

  render() {
    return (
      <form className="search-bar-area">
        <input
          type="text"
          placeholder="Search..."
          value={this.props.searchText}
          onChange={this.handleSearch}
        />
      </form>
    );
  }
}

// This component defines the area where office tables are laid
class OfficeArea extends React.Component {
  render() {
    return(
      <div className="office-area">
        {
          this.props.appData.tables.map((table) => {
						return (
                <SittingArea key={table.id}
                  id={table.id}
                  tableTitle = {table.title} 
                  numberOfSeats = {table.numberOfSeats}
                  seatsData = {table.seats}
                  employeeData = {this.props.appData.employees}
                  searchText={this.props.searchText}         
                />
            );
          })
        }
      </div>
    );
  }
}

// The following component is for rendering each set of office table and chairs
class SittingArea extends React.Component {
  render() {
    let sittingAreaDOM = [];

    this.props.seatsData.map((seat, i) => {
      let currentEmpIndex = this.props.employeeData.findIndex(emp => emp.seatIdentifier === seat.identifier);
      this.empData = this.props.employeeData[currentEmpIndex] !== -1 ? this.props.employeeData[currentEmpIndex] : null;
      if (i===2) {
        sittingAreaDOM.push(
          <SittingAreaTable key={this.props.id}
            tableTitle={this.props.tableTitle}
          />
        );
      }
      return sittingAreaDOM.push(
        <SittingAreaChair key={seat.identifier}
          seatData={seat}
          empData={this.empData}
          index={i}
          searchText={this.props.searchText}
        />
      );
    })
    return(
      <div className="sitting-area">
        {sittingAreaDOM}
      </div>
    );
  }
}

// This component renders chairs around office table
class SittingAreaChair extends React.Component {
  
  render() {
    let domElements;
    let isBottomChair = this.props.index >= 2;
    
    if (this.props.empData) {
      let searchText = this.props.searchText;
      let empFound = searchText && this.props.empData.name.toLowerCase().indexOf(searchText.toLowerCase())!== -1 ? true : false;
      domElements = <ChairTooltip title={<TooltipBox tooltipData={this.props.empData}/>} arrow placement="right">
        <div id={this.props.empData && this.props.empData.id }
        className={"emp-chair " +
          (isBottomChair ? "down-row " : "") +
          (empFound ? "highlight": "")}
        ></div>
      </ChairTooltip>
    } else {
      domElements = <div id={this.props.empData && this.props.empData.id }
      className={"emp-chair unfilled-chair " + 
        (isBottomChair ? "down-row " : "")}
      ></div>
    }
    return(
      domElements
    );
  }
}

// The following component controls the contents of tooltip
class TooltipBox extends React.Component {
  render() {
    return (
      <div>
        <img className="tooltip-emp-image" src={logo} alt="Pic"></img>
        <div className="tooltip-emp-name">{this.props.tooltipData.name}</div>
        <div className="tooltip-emp-desg">{this.props.tooltipData.designation}</div>
        <div className="tooltip-emp-team-text">Team</div>
        <div className="tooltip-emp-team">{this.props.tooltipData.team}</div>
        <div className="tooltip-emp-proj-text">Current projects</div>
        <div className="tooltip-emp-proj">{this.props.tooltipData.currentProject}</div>
      </div>
    );
  }
}

// This component renders table
class SittingAreaTable extends React.Component {
  render() {
    return(
      <div className="table">{this.props.tableTitle}</div>
    );
  }
}

ReactDOM.render(
  <EmployeeTrackerApp appData={DATA}/>,
  document.getElementById('root')
);

