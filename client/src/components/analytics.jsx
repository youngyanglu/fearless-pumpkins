import React from 'react';
import styles from '../../styles/analytics.css';
import BubbleApp from './BubbleChart/BubbleApp.jsx';

class Analytics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.analytics,
      category: 'Politics'
    }
    this.toGender = this.toGender.bind(this);
    this.toPolitics = this.toPolitics.bind(this);
  }

  componentDidMount() {
    var names = document.getElementsByClassName('user_name');
    if (this.state.data.infographicState.dem.percent >= 56) {
      document.getElementById('picture_frame').classList.add(styles.dem_background_color);
      for (var i = 0; i < names.length; i++) {
        names[i].classList.add(styles.dem_font_color);
      };
    } else if ((this.state.data.infographicState.dem.percent >= 50 && this.state.data.infographicState.dem.percent < 56) ||
                this.state.data.infographicState.rep.percent >= 50 && this.state.data.infographicState.rep.percent < 56){
      document.getElementById('picture_frame').classList.add(styles.mix_background_color);
      for (var i = 0; i < names.length; i++) {
        names[i].classList.add(styles.mix_font_color);
      };
    } else {
      document.getElementById('picture_frame').classList.add(styles.rep_background_color);
      for (var i = 0; i < names.length; i++) {
        names[i].classList.add(styles.rep_font_color);
      };
    }
    // Creates the doughnut chart using CanvasJS library.
    // Library can be found in client/dist/chart_lib
    var chartPol = new CanvasJS.Chart(styles.chartContainer, {
      height: 600,
      width: 800,
  		title:{
  			text: `${this.state.data.name}'s Percentage of Influence from Dem/Rep Party`
  		},
  		data: [
  		{
  			// Change type to "doughnut", "line", "splineArea", etc.
  			type: "doughnut",
  			dataPoints: [
  				{ color: '#304fd8', label: "Democrat",  y: parseFloat(this.state.data.infographicState.dem.percent).toFixed(2) },
  				{ color: '#d8201a', label: "Republican", y: parseFloat(this.state.data.infographicState.rep.percent).toFixed(2)  }
  			]
  		}
  		]
  	});

    chartPol.render();
  }

  toPolitics() {
    this.setState({
      category: 'Politics'
    })
    var chartPol = new CanvasJS.Chart(styles.chartContainer, {
      height: 600,
      width: 800,
      title:{
        text: `${this.state.data.name}'s Percentage of Influence from Dem/Rep Party`
      },
      data: [
      {
        // Change type to "doughnut", "line", "splineArea", etc.
        type: "doughnut",
        dataPoints: [
          { color: '#304fd8', label: "Democrat",  y: parseFloat(this.state.data.infographicState.dem.percent).toFixed(2) },
          { color: '#d8201a', label: "Republican", y: parseFloat(this.state.data.infographicState.rep.percent).toFixed(2)  }
        ]
      }
      ]
    });
    chartPol.render();
  }

  toGender() {
    this.setState({
      category: 'Gender'
    })
    var chartGender = new CanvasJS.Chart(styles.chartContainer, {
      height: 600,
      width: 800,
      title:{
        text: `${this.state.data.name}'s Gender Prediction`
      },
      data: [
      {
        // Change type to "doughnut", "line", "splineArea", etc.
        type: "doughnut",
        dataPoints: [
          { color: '#304fd8', label: "Female",  y: parseFloat(this.state.data.infographicState.female.percent).toFixed(2) },
          { color: '#d8201a', label: "Male", y: parseFloat(this.state.data.infographicState.male.percent).toFixed(2)  }
        ]
      }
      ]
    });
    chartGender.render();
  }

  render() {
    // Add image to the div inside profile_image div
    // .replace() is needed to get the larger size picture
    var profileImageStyle = {
      backgroundImage: `url(${(this.state.data.imageUrl).replace('_normal', '')})`
    };
    if (this.state.category === 'Politics') {
      return (
        <div className={styles.main_card}>
          <div className={styles.profile}>
            <button id={styles.homeButton} onClick={this.toGender}>GENDER</button>
            <div className={styles.profile_card}>
              <div id="picture_frame" className={styles.profile_image}>
                <div style={profileImageStyle}>
                </div>
              </div>

              <div className={styles.profile_info}>
                REAL NAME:
                <p>{this.state.data.name}</p>
                DESCRIPTION:
                <p>{this.state.data.description}</p>
                LOCATION:
                <p>{this.state.data.location}</p>
              </div>
            </div>

            <div className={styles.analytics_card}>
              <div id={styles.chartContainer} ></div>
              <div className={styles.chart_description}>
                <div className={styles.description_title}>CHART DESCRIPTION</div>
                <p>Based on a <i> Neural Network Algorithm of <a className="user_name">{this.state.data.name}</a>'s friends, </i>
                {this.state.data.name} appears to be <a className={styles.dem_font_color}>{parseFloat(this.state.data.infographicState.dem.percent).toFixed(0)}%
                Democrat</a> and <a className={styles.rep_font_color}>{parseFloat(this.state.data.infographicState.rep.percent).toFixed(0)}% Republican</a>.</p>
              </div>
            </div>
          </div>
        </div>
      )
    } else if (this.state.category === 'Gender') {
      return (
        <div className={styles.main_card}>
          <div className={styles.profile}>
             <button id={styles.homeButton} onClick={this.toPolitics}>POLITICS</button>
             <div className={styles.profile_card}>
                <div id="picture_frame" className={styles.profile_image}>
                   <div style={profileImageStyle}>
                   </div>
                </div>
                <div className={styles.profile_info}>
                   REAL NAME:
                   <p>{this.state.data.name}</p>
                   DESCRIPTION:
                   <p>{this.state.data.description}</p>
                   LOCATION:
                   <p>{this.state.data.location}</p>
                </div>
             </div>
             <div className={styles.analytics_card}>
                <div id={styles.chartContainer} ></div>
                   <div className={styles.chart_description}>
                      <div className={styles.description_title}>CHART DESCRIPTION</div>
                      <p>Based on a <i> Neural Network Algorithm of <a className="user_name">{this.state.data.name}</a>'s tweets</i>, 
                        the probability that {this.state.data.name} is <a className={styles.dem_font_color}>
                        female</a> is {parseFloat(this.state.data.infographicState.female.percent).toFixed(0)}% and the probability they are <a className={styles.rep_font_color}>male </a>  
                        is {parseFloat(this.state.data.infographicState.male.percent).toFixed(0)}%.
                      </p>
                   </div>
                </div>
             </div>
          </div>
        )
    }
  }   
};

export default Analytics;
