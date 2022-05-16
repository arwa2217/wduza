import React from "react";
import { connect } from "react-redux";
import axios from "axios";
import server from "server";
import { AuthHeader } from "../../../utilities/app-preference";
import { getFileSizeBytes } from "../../utils/file-utility";
import { CLEAR_PREVIEW_AVAILABLE_FLAG } from "../../../store/actionTypes/channelMessagesTypes";
import { withTranslation } from "react-i18next";

class ScrollComponent extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      photos: [],
      loading: false,
      loaded: false,
      error: false,
      page: 0,
      prevY: 0,
      count: 0,
      alreadyCalled: false,
      filePreview: false,
      isFresh: true,
      apiError: false,
    };
    this.retryCount = 0;
  }

  componentDidMount() {
    if (
      this.props.fileConfig &&
      this.props.fileConfig.mime.indexOf(this.props.fileInfo.mimeType) !== -1
    ) {
      if (
        getFileSizeBytes(this.props.fileInfo.fileSize) >
        getFileSizeBytes(this.props.fileConfig.maxfilesize)
      ) {
        this.setState({
          loading: false,
          loaded: true,
          error: true,
        });
      } else {
        this.getPhotos(this.state.page);
      }
    } else {
      this.getPhotos(this.state.page);
    }

    var options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    this.observer = new IntersectionObserver(
      this.handleObserver.bind(this),
      options
    );
    this.observer.observe(this.loadingRef);
  }

  handleObserver(entities, observer) {
    const y = entities[0].boundingClientRect.y;
    if (this.state.prevY > y) {
      const lastPhoto = this.state.photos[this.state.photos.length - 1];
      let curPage = parseInt(lastPhoto?.id) + 1;
      if (curPage <= this.state.count) {
        this.getPhotos(curPage);
        this.setState({ page: curPage });
      }
    }
    this.setState({ prevY: y });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.alreadyCalled && this.props.fileInfo.previewAvailable) {
      this.getPhotos(this.state.page);
      this.props.dispatch({
        type: CLEAR_PREVIEW_AVAILABLE_FLAG,
      });
    }
  }

  getPhotos(page) {
    let { channelId, postId } = this.props;
    if (!this.props.fileInfo.previewAvailable) {
      this.setState({ alreadyCalled: true });
    }
    if (!this.state.loading || this.state.error) {
      this.setState({ loading: true, alreadyCalled: false, error: false });
      let url =
        this.props?.viewType === "document-review"
          ? `/ent/v1/e-sign/filecontent/${this.props?.fileId}?email=${this.props.currentUser.email}&wopiCapable=false&isFresh=true&page=${page}&requestedpages=5`
          : this.props?.viewType === "certificate-view"
          ? `/ent/v1/e-sign/filecontent/${this.props?.certificateId}?email=${this.props.currentUser.email}&wopiCapable=false&isFresh=true&page=${page}&requestedpages=5`
          : this.props.fromFolder
          ? this.props.folderId
            ? `/ent/v2/filecontent/${this.props.fileId}?isFresh=${this.state.isFresh}&page=${page}&requestedpages=5&folderId=${this.props.folderId}`
            : `/ent/v2/filecontent/${this.props.fileId}?isFresh=${this.state.isFresh}&page=${page}&requestedpages=5&channelId=${channelId}&postId=${postId}`
          : `/ent/v1/filecontent/${this.props.fileId}?isFresh=${this.state.isFresh}&page=${page}&requestedpages=5&channelId=${channelId}&postId=${postId}`;
      axios
        .create({
          baseURL: server.apiUrl,
          headers: AuthHeader(),
        })
        .get(url)
        .then((res) => {
          if (res.data.data !== undefined) {
            var result = [];
            var json = res.data.data.data;
            var keys = Object.keys(json);
            keys.forEach(function (key) {
              let val = json[key];
              result.push({
                id: key,
                url: val,
              });
            });
            this.setState({
              photos: [...this.state.photos, ...result],
              count: res.data.data.Size,
              loading: false,
              loaded: true,
              error: false,
              lastCall: page,
              alreadyCalled: false,
              isFresh: false,
            });
            this.retryCount = 0;
          } else {
            this.setState({
              loading: false,
              loaded: true,
              error: true,
              alreadyCalled: false,
              apiError: true,
            });
            this.retryCount = 0;
          }
        })
        .catch((error) => {
          // handle error
          this.setState({
            error: true,
            apiError: true,
            alreadyCalled: true,
          });

          console.log(error, "api error");
        });
    }
  }

  render() {
    const { t } = this.props;

    return (
      <div
        className="container"
        style={{ width: "100%", borderLeft: "none" }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <div className="infinite-scroll-container">
          {this.state.photos.map((page, index) => {
            return (
              <div key={`div${page.id}`} className="page-wrapper">
                <p key={`p${page.id}`}>
                  {t("page")}-{page.id}
                </p>
                <img
                  src={`data:image/jpeg;base64,${page.url}`}
                  width="100%"
                  key={`img${page.id}`}
                  id={`img${page.id}`}
                  alt=""
                  style={{ pointerEvents: "none" }}
                />
              </div>
            );
          })}
          <div ref={(loadingRef) => (this.loadingRef = loadingRef)}>
            <span
              style={{
                height: "100px",
                margin: "30px",
                display:
                  this.state.loading && !this.state.apiError ? "block" : "none",
              }}
            >
              Fetching document preview. Please wait..
            </span>
            <span
              style={{
                height: "100px",
                margin: "30px",
                display: this.state.apiError ? "block" : "none",
              }}
            >
              Preview not available.
            </span>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    fileConfig: state.config.fileConfig,
    currentUser: state.AuthReducer.user,
    filePreviewAvailableId: state.channelMessages.filePreviewAvailableId,
  };
}
export default connect(mapStateToProps)(withTranslation()(ScrollComponent));
