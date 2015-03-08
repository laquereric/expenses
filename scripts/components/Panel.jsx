var React = require('react/addons');
var cx = React.addons.classSet;
var _ = require('lodash');

var SelectionStore = require('../stores/SelectionStore');
var CategoryStore = require('../stores/CategoryStore');
var ExpenseStore = require('../stores/ExpenseStore');
var HomeComponent = require('./Home.jsx');
var AddCategoryComponent = require('./AddCategory.jsx');
var AddExpenseComponent = require('./AddExpense.jsx');
var SummaryComponent = require('./Summary.jsx');
var CategoryDetailComponent = require('./CategoryDetail.jsx');
var ExpenseDetailComponent = require('./ExpenseDetail.jsx');
var ViewActionCreators = require('../actions/ViewActionCreators');
var AppCalculationUtils = require('../utils/AppCalculationUtils');

// notes: how to stagger transitions?
// eventually use immutable diff?
// todo: home
var ExpenseApp = React.createClass({
  getInitialState() {
    var top = 58;
    return {
      selection: SelectionStore.getSelection(),
      panelBody: "home",
      justSelected: false,
      top: top,
      height: window.innerHeight - top
    }
  },
  componentDidMount() {
    window.addEventListener('resize', this._onWindowResize);
    window.addEventListener('keypress', this.windowKeyPress);
    SelectionStore.addChangeListener(this._onChange);
    this._onChange(); // TODO: remove this later, better to have it go through dispatcher
  },
  componentWillReceiveProps(nextProps) {
    // if selection not in expenses, send unselectNode
    var selectionExists = _.chain(nextProps.data.expenses)
      .pluck('id')
      .union(_.pluck(nextProps.data.categories, 'id'))
      .contains(this.state.selection && this.state.selection.id)
      .value();
    if (!selectionExists) {
      AppCalculationUtils.callViewActionCreators(() => {
        ViewActionCreators.unselectNode();
      });
    }
  },
  componentWillUnMount() {
    window.removeEventListener('resize', this._onWindowResize);
    window.removeEventListener('keypress', this.windowKeyPress);
    SelectionStore.removeChangeListener(this._onChange);
  },
  _onWindowResize() {
    var height = window.innerHeight - this.state.top;
    this.setState({height});
  },
  _onChange() {
    var selection = SelectionStore.getSelection();
    var panelBody = selection ? 'summary' : this.state.panelBody;
    var justSelected = selection ? true : false;

    var state = React.addons.update(this.state, {
      $merge: {selection, panelBody, justSelected}
    });
    this.setState(state);
  },
  render() {
    return (
      <div className="Panel">
        {this.renderHeader()}
        {this.renderBody()}
      </div>
    );
  },
  renderHeader() {
    var addClasses = cx({
      "glyphicon": true,
      "glyphicon-plus-sign": true,
      "selected": this.state.panelBody === 'add'
    });
    var homeClasses = cx({
      "glyphicon": true,
      "glyphicon-home": true,
      "selected": this.state.panelBody === 'home'
    });
    var settingClasses = cx({
      "glyphicon": true,
      "glyphicon-cog": true,
      "selected": this.state.panelBody === 'settings'
    });
    var summaryClasses = cx({
      "glyphicon": true,
      "glyphicon-th-list": true,
      "selected": this.state.panelBody === 'summary'
    });

    // take out settings for now, can't remember what i was gonna do with it...
    // <span className={settingClasses} onClick={this.clickHeaderIcon.bind(this, 'settings')} />
    return (
      <div className="Panel-header">
        <span className={summaryClasses} onClick={this.clickHeaderIcon.bind(this, 'summary')} />
        <span className={addClasses} onClick={this.clickHeaderIcon.bind(this, 'add')} />
        <span className={homeClasses} onClick={this.clickHeaderIcon.bind(this, 'home')} />
      </div>
    );
  },
  renderBody() {
    var body = null;
    if (this.state.panelBody === 'home') {
      body = (<HomeComponent />);
    } else if (this.state.justSelected || this.state.panelBody === 'summary') {
      if (this.state.selection) {
        // if no category or expense is selected, then default to one of the header icons
        if (this.state.selection.type === 'category') {
          body = (<CategoryDetailComponent data={this.state.selection}
            expenses={this.props.data.expenses} />);
        } else if (this.state.selection.type === 'expense') {
          body = (<ExpenseDetailComponent data={this.state.selection} />);
        }
      } else {
        body = (<SummaryComponent categories={this.props.data.categories}
          expenses={this.props.data.expenses} />);
      }
    } else if (this.state.panelBody === 'add') {
      body = (
        <div className="Panel-body-add">
          <AddExpenseComponent />
          <AddCategoryComponent />
        </div>
      );
    }

    var bodyStyle = {"max-height": this.state.height};
    return (
      <div className="Panel-body" style={bodyStyle}>
        {body}
      </div>
    );
  },
  windowKeyPress(e) {
    var CHAR_A = 97; // add
    var CHAR_H = 104; // home
    var CHAR_S = 115; // settings
    var CHAR_D = 100; // delete
    var pressedKey = e.keyCode;

    if (pressedKey === CHAR_A) {
      this.clickHeaderIcon('add');
    } else if (pressedKey === CHAR_H) {
      this.clickHeaderIcon('home');
    } else if (pressedKey === CHAR_D) {
      this.deleteSelection();
    } else if (pressedKey === CHAR_S) {
      this.clickHeaderIcon('summary');
    }
  },
  clickHeaderIcon(icon) {
    var state = React.addons.update(this.state, {
      $merge: {panelBody: icon, justSelected: false}
    });
    this.setState(state);
  },
  deleteSelection() {
    if (!this.state.selection) return;
    var id = this.state.selection.id;
    if (this.state.selection.type === 'category') {
      ViewActionCreators.deleteCategory(id);
    } else if (this.state.selection.type === 'expense') {
      ViewActionCreators.deleteExpense(id);
    }
    
    ViewActionCreators.unselectNode();
  }
});

module.exports = ExpenseApp;