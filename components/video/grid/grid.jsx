import React from 'react'
import { get } from '../../../lib/fetch-methods'
import GridPreview from '../grid-preview/grid-preview'
import TextClamp from '../../util/text-clamp/text-clamp'
import Button from '../../util/button/button'
import TimeAndViews from '../../util/time-and-views/time-and-views'
import ButtonMore from '../../util/buttons/load-more'
import Trans from '../../util/trans/trans'

export default class VideosGrid extends React.Component {
  trans = DM_ENV['video/grid']
  currentPage = 1
  lastQuery = null
  videos = []
  hasMore = false

  state = {
    videos: [],
    failed: false,
    hasMore: false,
    loading: false,
    searching: false,
    err: null
  }

  static propTypes = {
    sortBy: React.PropTypes.string,
    limit: React.PropTypes.number,
    flags: React.PropTypes.array,
    endpoint: React.PropTypes.string,
    searchTerm: React.PropTypes.string,
  }

  static defaultProps = {
    sortBy: 'recent',
    limit: 3,
    flags: [],
    endpoint: '/videos',
    colSize: 3,
    searchTerm: null
  }

  componentDidMount(){
    // console.log('Mounting grid with', this.props)
    this.loadVideos('setInitialVideos', this.props)
  }

  componentWillReceiveProps(nextProps){
    if(this.hasPropsChanged(this.props, nextProps)){
      this.currentPage = 1
      this.loadVideos('replaceVideos', nextProps)
    }
  }

  hasPropsChanged(oldProps, nextProps){
    return JSON.stringify({
      sortBy: oldProps.sortBy,
      limit: oldProps.limit,
      flags: (oldProps.flags||[]).join(','),
      endpoint: oldProps.endpoint,
      searchTerm: oldProps.searchTerm
    }) !== JSON.stringify({
      sortBy: nextProps.sortBy,
      limit: nextProps.limit,
      flags: (nextProps.flags||[]).join(','),
      endpoint: nextProps.endpoint,
      searchTerm: nextProps.searchTerm
    })
  }

  // Allow us to store the first set of videos to avoid hitting API after a search
  setInitialVideos(videos, hasMore){
    if(videos.length === 0 && this.props.ifEmpty) this.props.ifEmpty()
    this.videos = videos
    this.hasMore = hasMore
    this.replaceVideos(videos, hasMore)
  }

  loadVideos(cb, props){
    if(this.refs.videoResults) this.refs.videoResults.style.opacity = .4
    let data = {
      fields: GridPreview.apiFields.join(','),
      page: this.currentPage,
      thumbnail_ratio: 'widescreen',
      sort: props.sortSelection || props.sortBy,
      limit: props.limit,
      localization: 'en_ZH' //must pass a non-existent language in order to have sort working in current API (lol)
    }
    let endpoint = props.endpoint ? props.endpoint : '/videos'

    if(props.searchTerm)
      data.search = props.searchTerm

    if(props.flags && props.flags.length)
      data.flags = props.flags.join(',')

    get(this.props.apiURL + endpoint, {data})
    .then(res => this[cb](res.list, res.has_more))
    .catch(err => {
      console.error('Failed to fetch videos', query, err)
      this.setState({failed: this.currentPage === 1, hasMore: false, searching: false, loading: false})
    })
  }

  appendVideos(videos, hasMore){
    this.setState({hasMore, videos: this.state.videos.concat(videos), failed: false, loading: false})
    this.refs.videoResults.style.opacity = 1
    this.currentPage++
  }

  replaceVideos(videos, hasMore){
    this.setState({hasMore, videos, loading: false, failed: false})
    this.refs.videoResults.style.opacity = 1
    this.currentPage++
  }

  loadMore(){
    if(typeof(DM_Events) !== 'undefined')
      DM_Events.trigger('channel_load_more', {ga: {label: this.props.id.charAt(0).toUpperCase() + this.props.id.substr(1)}})
    this.loadVideos('appendVideos', this.props)
  }

  renderVideos() {
    if(this.state.videos.length === 0){
      return (
        <div className="no-results"><Trans context={this.trans}>noVideosFound</Trans></div>
      )
    }
    const containerWidth = this.refs.videoResults.getBoundingClientRect().width
    return this.state.videos.map((video,index) =>
      <div key={'vid.'+index} style={{
          width: (containerWidth / this.props.colSize) - 20,
          marginRight: (index+1) % this.props.colSize !== 0 ? 20 : 0,
          marginBottom: 20,
          flexGrow: 'grow',
        }}> {/*className={`col-sm-3 col-md-${this.props.colSize} mrg-btm-lg grid-item`}*/}
        <GridPreview {...video} className="mrg-btm-md"/>
        <div className="video-meta">
          <h4>
            <a href={video.uri} className="link">
              <TextClamp clamp="2">{video.title}</TextClamp>
            </a>
          </h4>
          <TimeAndViews noUploadLabel={true} time={video.created_time} views={video.views_total}/>
        </div>
      </div>
    )
  }

  onLoadError(){
    return (
      <div><h3 className="font-lg"><Trans context={this.trans}>loadErrorMsg</Trans></h3></div>
    )
  }

  searchTermSection(){
    return(
      <div className="search-term">
        <span className="label"><Trans context={this.trans}>searchingFor</Trans></span>
        <span className="value">{this.state.searchTerm}</span>
      </div>
    )
  }

  render() {
    let css = ['video-list']
    if(this.state.searching) css.push('searching')
    if(this.state.loading) css.push('loading')
    return (
      <div ref="videoResults">
        {this.state.searchTerm ? this.searchTermSection() : null}
        {
          this.state.failed ?
          this.onLoadError():
          <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}>
            {this.renderVideos()}
          </div>}
        {
          this.state.hasMore?
          <Button fullWidth={true} loading={this.state.loading} onPress={()=>this.loadMore()}>Load more</Button>:
          null
        }
      </div>
    )
  }
}