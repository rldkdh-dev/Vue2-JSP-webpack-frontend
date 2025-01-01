var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: {
    // 삼성라이온즈
    /*
      WEB 관련 페이지
    */
   
   // 메인페이지
     index: './src/router/frm_main/main/index-controller.js'
    //  ,main_menu: './src/router/frm_main/main-menu-controller.js'
    //  ,main_page_header: './src/router/frm_main/main-page-header-controller.js'
    //  ,main_login: './src/router/frm_main/main-login-controller.js'
    //  ,system_user: './src/router/frm_main/system/security/system-user-controller.js'

  // 관리자 페이지 관련
  ,admin_login: './src/router/frm_admin/admin-login-controller.js'
  // ,admin_loginchange:'./src/router/frm_admin/admin-loginchange-controller.js'
  ,admin_header :'./src/router/frm_admin/admin_header-controller.js'
  ,admin_menu :'./src/router/frm_admin/admin_menu-controller.js'
  ,admin_page_header :'./src/router/frm_admin/admin_page_header-controller.js'

  // 관리자 회원
  // ,member: './src/router/frm_admin/member/member-controller.js'
  // ,delivery: './src/router/frm_admin/member/delivery-controller.js'
  // ,memberDel: './src/router/frm_admin/member/memberDel-controller.js'
  // ,kids: './src/router/frm_admin/member/kids-controller.js'
  
  // // 관리자 승급
  // ,grade: './src/router/frm_admin/base/grade-controller.js'
  // ,point: './src/router/frm_admin/base/point-controller.js'

  // 관리자 콘텐츠
  ,coupon :'./src/router/frm_admin/contents/coupon-controller.js'
  ,season: './src/router/frm_admin/contents/season-controller.js'

  },
  output: {
    path: path.resolve(__dirname, './../../src/main/webapp/contents/noaa/js/model/vue'),
    publicPath: '/vue-controller/',
    filename: '[name]-controller.min.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.sass$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader?indentedSyntax'
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': [
              'vue-style-loader',
              'css-loader',
              'sass-loader'
            ],
            'sass': [
              'vue-style-loader',
              'css-loader',
              'sass-loader?indentedSyntax'
            ]
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   sourceMap: true,
    //   compress: {
    //     warnings: false
    //   }
    // }),
    new webpack.LoaderOptionsPlugin({
      minimize: false
    })
  ])
}
