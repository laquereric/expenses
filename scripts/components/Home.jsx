var React = require('react/addons');
var cx = React.addons.classSet;
var CategoryComponent = require('./Category.jsx');
var ExpenseComponent = require('./Expense.jsx');

var Home = React.createClass({
  getInitialState() {
    return {
      top: 0,
      left: 0,
      displayModal: 'auto'
    }
  },
  componentDidMount() {
    this._onWindowResize();
    window.addEventListener('resize', this._onWindowResize);
  },
  componentWillUnmount() {
    window.removeEventListener('resize', this._onWindowResize);
  },
  _onWindowResize() {
    var element = this.refs.body.getDOMNode();
    var width = element.offsetWidth;
    var height = element.offsetHeight;
    var top = (window.innerHeight - height) / 2;
    var left = (window.innerWidth - width) / 2;
    this.setState({top, left});
  },
  closeModal() {
    this.setState({displayModal: 'none'});
  },
  render() {
    var homeStyle = {display: this.state.displayModal};
    var bodyStyle = {top: this.state.top, left: this.state.left};

    return (
      <div style={homeStyle}>
        <div className="Home-backdrop" onClick={this.closeModal} />
        <div className="Home-body" ref="body" style={bodyStyle}>
          <div className="Home-close glyphicon glyphicon-remove" onClick={this.closeModal} />
          {this.renderDirections()}
          {this.renderAbout()}
        </div>
      </div>
    );
  },
  renderDirections() {
    var addClasses = cx({
      "glyphicon": true,
      "glyphicon-plus-sign": true
    });
    var categoryStyle = {width: 50, height: 40};
    var categoryData = {name: 'Coffee', size: 7.5, x: 25, y: 11, fill: '#FF8800', selected: true};
    var category = (
      <svg style={categoryStyle}>
        <CategoryComponent data={categoryData} />
      </svg>
    );
    var expenseStyle = {width: 50, height: 32};
    var expenseData = {name: 'Coffee Bar', size: 10, x: 25, y: 9, selected: true};
    var expense = (
      <svg style={expenseStyle}>
        <ExpenseComponent data={expenseData} />
      </svg>
    );
    return (
      <div className="Directions-body">
        <h4>Add</h4>
        <p>
          From the Add tab:<br />
          {category} add some categories,<br />
          {expense} and then add some expenses.<br />
        </p>
        <h4>Drag</h4>
        <p>
          Add an expense by dragging it over a category, drag again to remove.<br />
          An expense can belong to multiple categories.
        </p>
        <h4>Click</h4>
        <p>
          Click on any expense or category to view it in detail, click again to deselect.<br />
          While in detail view, take actions (delete, close) from the bottom bar.<br />
          The graph shows a week of expenses at a time.
        </p>
      </div>
    );
  },
  renderAbout() {
    return (
      <div className="About-body">
        <p>
        This simple expense-tracking app started out as an example app for a blog post on <a href="http://d3js.org/" target="_new">D3</a>+ 
        <a href="http://facebook.github.io/react/" target="_new">React</a>+ 
        <a href="http://facebook.github.io/flux/docs/overview.html" target="_new">Flux</a>.
        The blog post itself has yet to be written, but you can find the <a href="https://github.com/sxywu/expenses" target="_new">source code here</a>.
        </p>
        <u>Next steps (because I'm addicted)</u>:
        <li>Set up a node server and store data in database</li>
        <li>Hook up <a href="https://plaid.com/" target="_new">Plaid</a> API, import credit card transactions (manual input?  Ain't nobody got time for that)</li>
        <li>Better mobile compatibility</li>
        <li>Better design and styling</li>
        <p>
        <a href="https://twitter.com/shirleyxywu" target="_new">Let me know what you think</a><br />
        <a href="https://github.com/sxywu/expenses/issues" target="_new">Tell me if you find a bug</a><br />
        </p>
      </div>
    );
  }
});

module.exports = Home;