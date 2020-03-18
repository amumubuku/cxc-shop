<template>
  <div class="comment-wrp">
    <div class="comment-top">
      <div class="flex-left">
        <span>{{shopinfo.shop_score}}</span>
        <p>商家评分</p>
      </div>
      <div class="flex-right">
        <div class="packagp-rate" >
          <p class="text">口味</p>
          <div class="rate-level-img">
            <img
              src="https://img.icaixiaochu.com/rate.png"
              alt
              v-for="(item, index) in ~~shopinfo.taste_score"
              :key="index"
            />
          </div>
          <p class="level">{{shopinfo.taste_score}}</p>
        </div>
        <div class="kw-rate" style="padding-top:14px;">
          <p class="text">包装</p>
          <div class="rate-level-img">
            <img
              src="https://img.icaixiaochu.com/rate.png"
              alt
              v-for="(item, index) in ~~shopinfo.shop_score"
              :key="index"
            />
          </div>
          <p class="level">{{shopinfo.shop_score}}</p>
        </div>
      </div>
    </div>
    <div class="comments-category">
      <div class="comment-item" @click="commentType = 'all'">
        <div class="icon">
          <img src alt />
        </div>
        <p>全部评价({{commentNum.all_eval}})</p>
      </div>
      <div class="comment-item" @click="commentType = 'picture'">有图评价({{commentNum.picture}})</div>
      <div class="comment-item" @click="commentType = 'good'">
        <div class="icon">
          <img src="../../../../static/images/comment-icon2.png" alt />
        </div>
        <p>好评({{commentNum.good}})</p>
      </div>
      <div class="comment-item" @click="commentType = 'bad'">
        <div class="icon">
          <img src="../../../../static/images/comment-icon1.png" alt />
        </div>
        <p>差评({{commentNum.bad}}))</p>
      </div>
    </div>
    <div class="comments">
      <div class="comment-list">
        <div class="comments-item" v-for="(item, index) in comments" :key="index">
          <div class="user-cover">
            <img :src="item.avatar_url" alt />
          </div>
          <div class="comments-info">
            <div class="head-comment-top">
              <div class="flex-left">
                <div class="user-name">{{item.nick_name}}</div>
                <div class="comments-level">
                  <img
                    src="https://img.icaixiaochu.com/rate.png"
                    v-for="(data, k) in  item.shop"
                    :key="k"
                    alt
                  />
                </div>
              </div>
              <div class="time">{{item.create_at}}</div>
            </div>
            <p class="comments-text">
              {{item.content}}
            </p>
            <!-- <div class="shop-reply-text">
              <p>商家回复：听说喜欢夸人的人，颜值都特别高</p>
            </div> -->
            <div class="comments-imgs" v-if="item.image.length > 1">
              <img v-for="(data, i) in item.image" :key="i" :src="data" alt />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['shopinfo'],
  data () {
    return {
      comments: '',
      commentType: 'all',
      commentNum: '',
      page: 1
    }
  },
  methods: {
    getCommentList () {
      this.$http.post('/fetchEvaluate', {shop_id: this.shopinfo.id, status: this.commentType}).then(res => {
        this.comments = res.data
      })
      if (!this.commentNum) {
        this.$http.post('/getEvaluateCount', {shop_id: this.shopinfo.id, page: this.page}).then(res => {
          this.commentNum = res.data
        })
      }
    }
  },
  watch: {
    commentType (newVal, oldVal) {
      this.page = 1
      this.comments = []
      this.getCommentList()
    }
  }
}
</script>

<style lang="less" scope>
.comment-wrp {
  padding-bottom: 54px;
  .comment-top {
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f2f2f2;
    .flex-left {
      flex: 1;
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      justify-content: center;
      span {
        font-size: 30px;
        font-weight: 800;
        color: rgba(253, 82, 0, 1);
      }
      p {
        font-size: 11px;
        font-weight: 400;
        color: rgba(120, 120, 120, 1);
      }
    }
    .flex-right {
      flex: 1;
      display: flex;
      flex-flow: column nowrap;
      align-items: flex-start;
      justify-items: flex-start;
      padding-left: 48px;
      .packagp-rate,
      .kw-rate {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .text {
          font-size: 13px;
          font-weight: 400;
          color: rgba(120, 120, 120, 1);
        }
        .rate-level-img {
          height: 12px;
          display: flex;
          align-items: center;
          margin-left: 6px;
          img {
            width: 12px;
            height: 12px;
            margin-right: 6px;
          }
        }
        .level {
          font-size: 13px;
          font-weight: 400;
          color: rgba(244, 186, 28, 1);
        }
      }
    }
  }
  .comments-category {
    display: flex;
    align-items: center;
    flex-flow: row wrap;
    justify-content: space-between;
    padding: 20px 14px;
    padding-bottom: 0;
    .comment-item {
      width: 168px;
      height: 37px;
      border: 1px solid rgba(232, 232, 232, 1);
      border-radius: 5px;
      margin-bottom: 14px;
      font-size: 13px;
      font-weight: 400;
      color: rgba(120, 120, 120, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      .icon {
        width: 14px;
        height: 14px;
        margin-right: 6px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .comments {
    .comment-list {
      .comments-item {
        display: flex;
        align-items: flex-start;
        padding-left: 14px;
        padding-top: 16px;
        .user-cover {
          width: 34px;
          height: 100%;
          margin-right: 6px;
          border-right: 4px;
          img {
            width: 34px;
            height: 34px;
            background: #ccc;
          }
        }
        .comments-info {
          flex: 1;
          border-bottom: 1px solid #f2f2f2;
          padding-right: 14px;
          .head-comment-top {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            .flex-left {
              .user-name {
                font-size: 15px;
                font-weight: 400;
                line-height: 21px;
                color: rgba(33, 33, 33, 1);
              }
              .comments-level {
                display: flex;
                align-items: center;
                img {
                  width: 12px;
                  height: 12px;
                  margin-right: 2px;
                }
              }
            }
            .time {
              font-size: 11px;
              font-weight: 400;
              line-height: 16px;
              color: rgba(165, 165, 165, 1);
              padding-right: 14px;
            }
          }
          .comments-text {
            font-size: 13px;
            font-weight: 400;
            line-height: 18px;
            color: rgba(120, 120, 120, 1);
            padding: 10px 0;
          }
          .shop-reply-text {
            height: 30px;
            background: rgba(242, 242, 242, 1);
            border: 1px solid rgba(232, 231, 234, 0.5);
            border-radius: 10px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            p {
              font-size: 11px;
              font-weight: 400;
              color: rgba(33, 33, 33, 1);
              padding-left: 10px;
            }
          }
          .comments-imgs {
            display: flex;
            align-items: center;
            margin-bottom: 18px;
            img {
              width: 95px;
              height: 95px;
              margin-right: 10px;
              background: #ccc;
            }
          }
        }
      }
    }
  }
}
</style>