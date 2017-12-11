import React from 'react';
import {connect} from 'dva';
import _ from 'lodash';
import {
    Button, ButtonGroup, Col, ControlLabel, FormControl, FormGroup, Glyphicon, ProgressBar, Row,
    Well
  } from 'react-bootstrap';
  import { routerRedux } from 'dva/router';
import SelectStudyWords from './SelectStudyWords';
const wellHeight = 400;

class ShanbayView extends React.Component {
    constructor(props) {
        super(props);
        
    }
    
   
    render() {
        const { shanbay} = this.props;
        if (!shanbay) {
          return (
            <Well  style={{height: wellHeight}} bsSize="large" height={wellHeight}>
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
    
              加载中...
              </div>
            </Well>
            )
        } else {
          return (
            <Well  style={{height: wellHeight}} bsSize="large" height={wellHeight}>
    
              <Row>
                <Col md={2}>单词</Col>
                <Col md={10}><div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><h2>{shanbay.content}</h2></div></Col>
              </Row>
              <Row>
                <Col md={2}>音标</Col>
                <Col md={10}><div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><h2 dangerouslySetInnerHTML={{__html:shanbay.pron}}></h2></div></Col>
              </Row>
              <Row>
                <Col md={2}>解释</Col>
                <Col md={10}><div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><h2>{shanbay.definition}</h2></div></Col>
              </Row>
              <Row>
                <Col md={2}>美音</Col>
                <Col md={10}>
                  <audio src={shanbay.us_audio} autoPlay controls><Glyphicon glyph="headphones" /></audio>
                  {/*glyphicon glyphicon-headphones*/}
    
                </Col>
              </Row>
              <Row>
                <Col md={2}>英英解释</Col>
                <Col md={10}>{_.get(shanbay, 'en_definition.defn')}</Col>
              </Row>
              {/*<div>单词: {shanbay.content}</div>*/}
              {/*<div>发音: {shanbay.pron}</div>*/}
              {/*<div>解释: {shanbay.definition}</div>*/}
              {/*<div>us_audio: {shanbay.us_audio}</div>*/}
              {/*<div>英英解释: {shanbay.en_definition.defn}</div>*/}
            </Well>
          )
        }
    }
};
export default connect()(ShanbayView);
