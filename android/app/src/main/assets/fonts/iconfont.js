/* eslint-disable eqeqeq */
/* eslint-disable no-bitwise */
/* eslint-disable no-void */
/* eslint-disable no-shadow */
/* eslint-disable no-catch-shadow */
!(function (c) {
  var t,
    e,
    o,
    a,
    i,
    l =
      '<svg><symbol id="icon-message" viewBox="0 0 1024 1024"><path d="M640 416l-256 0c-17.664 0-32-14.336-32-32s14.336-32 32-32l256 0c17.696 0 32 14.336 32 32S657.696 416 640 416z"  ></path><path d="M579.264 544 384 544c-17.664 0-32-14.336-32-32s14.336-32 32-32l195.264 0c17.696 0 32 14.336 32 32S596.928 544 579.264 544z"  ></path><path d="M962.24 448c0-211.744-200.96-384-448-384s-448 172.256-448 384c0 116.512 63.04 226.048 172.928 300.672 14.624 9.984 34.528 6.144 44.448-8.512 9.92-14.624 6.112-34.528-8.512-44.448C183.04 633.216 130.24 542.944 130.24 448c0-176.448 172.256-320 384-320 211.744 0 384 143.552 384 320 0 176.448-172.256 320-384 320-1.984 0-3.68 0.768-5.568 1.12-15.136-2.72-30.464 5.216-35.776 20.192-6.144 17.376-46.368 46.656-94.144 73.792 17.44-58.208 9.088-70.688 3.488-78.976-6.72-9.984-17.92-15.936-29.92-15.936-17.664 0-32 14.304-32 32 0 5.824 1.536 11.264 4.256 15.968-3.232 18.208-17.216 60.832-33.056 99.84-4.928 12.096-1.984 25.984 7.392 35.072 6.08 5.888 14.112 8.992 22.272 8.992 4.384 0 8.8-0.896 12.992-2.752 36.48-16.256 147.648-69.12 187.616-125.632C765.344 828.16 962.24 657.568 962.24 448z"  ></path></symbol><symbol id="icon-back_android" viewBox="0 0 1024 1024"><path d="M800 480H268.8l233.6-233.6c12.8-12.8 12.8-32 0-44.8-12.8-12.8-32-12.8-44.8 0l-284.8 288c-12.8 12.8-12.8 32 0 44.8h3.2l284.8 288c6.4 6.4 16 9.6 22.4 9.6 9.6 0 16-3.2 22.4-9.6 12.8-12.8 12.8-32 0-44.8L272 544H800c19.2 0 32-12.8 32-32s-16-32-32-32z"  ></path></symbol><symbol id="icon-scan" viewBox="0 0 1024 1024"><path d="M136 384h56c4.4 0 8-3.6 8-8V200h176c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H196c-37.6 0-68 30.4-68 68v180c0 4.4 3.6 8 8 8zM648 200h176v176c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V196c0-37.6-30.4-68-68-68H648c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zM376 824H200V648c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v180c0 37.6 30.4 68 68 68h180c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM888 640h-56c-4.4 0-8 3.6-8 8v176H648c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h180c37.6 0 68-30.4 68-68V648c0-4.4-3.6-8-8-8zM904 476H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"  ></path></symbol><symbol id="icon-download" viewBox="0 0 1024 1024"><path d="M505.7 661c3.2 4.1 9.4 4.1 12.6 0l112-141.7c4.1-5.2 0.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8z"  ></path><path d="M878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"  ></path></symbol><symbol id="icon-pause" viewBox="0 0 1024 1024"><path d="M304 176h80v672h-80zM712 176h-64c-4.4 0-8 3.6-8 8v656c0 4.4 3.6 8 8 8h64c4.4 0 8-3.6 8-8V184c0-4.4-3.6-8-8-8z"  ></path></symbol><symbol id="icon-play" viewBox="0 0 1024 1024"><path d="M384 752.288l299.68-231.552L384 289.152V752.32z m-64 65.152V224a32 32 0 0 1 51.552-25.312l384 296.704a32 32 0 0 1 0 50.656l-384 296.736A32 32 0 0 1 320 817.44z"  ></path></symbol><symbol id="icon-search" viewBox="0 0 1024 1024"><path d="M685.6 660.336l155.152 155.168a16 16 0 0 1 0 22.624l-11.312 11.328a16 16 0 0 1-22.624 0l-158.528-158.544a289.792 289.792 0 0 1-165.152 51.36C322.336 742.256 192 611.904 192 451.12 192 290.336 322.336 160 483.136 160c160.784 0 291.12 130.336 291.12 291.136 0 82.112-33.984 156.272-88.672 209.2z m-202.464 33.92c134.272 0 243.12-108.848 243.12-243.12C726.256 316.848 617.408 208 483.136 208 348.848 208 240 316.848 240 451.136c0 134.272 108.848 243.12 243.136 243.12z"  ></path></symbol><symbol id="icon-love" viewBox="0 0 1024 1024"><path d="M917.333333 166.4c-106.666667-106.666667-285.866667-106.666667-392.533333 0l-12.8 17.066667-17.066667-12.8C388.266667 64 209.066667 64 102.4 170.666667s-106.666667 285.866667 0 392.533333l375.466667 375.466667c17.066667 17.066667 42.666667 17.066667 59.733333 0l375.466667-375.466667c110.933333-110.933333 110.933333-290.133333 4.266666-396.8z"  ></path></symbol><symbol id="icon-xiangji" viewBox="0 0 1024 1024"><path d="M269.44 256l23.296-75.381333A74.666667 74.666667 0 0 1 364.074667 128h295.850666a74.666667 74.666667 0 0 1 71.338667 52.618667L754.56 256H821.333333c64.8 0 117.333333 52.533333 117.333334 117.333333v426.666667c0 64.8-52.533333 117.333333-117.333334 117.333333H202.666667c-64.8 0-117.333333-52.533333-117.333334-117.333333V373.333333c0-64.8 52.533333-117.333333 117.333334-117.333333h66.773333z m23.605333 64H202.666667a53.333333 53.333333 0 0 0-53.333334 53.333333v426.666667a53.333333 53.333333 0 0 0 53.333334 53.333333h618.666666a53.333333 53.333333 0 0 0 53.333334-53.333333V373.333333a53.333333 53.333333 0 0 0-53.333334-53.333333h-90.378666a32 32 0 0 1-30.570667-22.549333l-30.272-97.930667a10.666667 10.666667 0 0 0-10.186667-7.52H364.074667a10.666667 10.666667 0 0 0-10.186667 7.52l-30.272 97.92A32 32 0 0 1 293.045333 320zM512 725.333333c-88.362667 0-160-71.637333-160-160 0-88.362667 71.637333-160 160-160 88.362667 0 160 71.637333 160 160 0 88.362667-71.637333 160-160 160z m0-64a96 96 0 1 0 0-192 96 96 0 0 0 0 192z"  ></path></symbol><symbol id="icon-Love" viewBox="0 0 1024 1024"><path d="M511.5904 856.064a20.8896 20.8896 0 0 1-14.7456-6.144l-296.96-297.7792a216.2688 216.2688 0 0 1-65.1264-158.5152 224.8704 224.8704 0 0 1 376.832-166.7072 226.5088 226.5088 0 0 1 151.552-58.9824 225.6896 225.6896 0 0 1 225.6896 225.6896 200.2944 200.2944 0 0 1-65.9456 158.9248l-297.3696 297.3696a20.0704 20.0704 0 0 1-13.9264 6.144zM359.6288 208.896a183.9104 183.9104 0 0 0-183.9104 184.7296 175.3088 175.3088 0 0 0 54.4768 131.072l6.5536 6.9632 274.8416 274.8416 282.624-282.624a160.5632 160.5632 0 0 0 54.0672-130.2528A184.7296 184.7296 0 0 0 663.552 208.896 183.9104 183.9104 0 0 0 532.48 262.9632l-7.3728 7.7824a25.3952 25.3952 0 0 1-14.7456 5.7344 19.6608 19.6608 0 0 1-14.7456-6.5536l-4.096-7.3728A182.6816 182.6816 0 0 0 359.6288 208.896z"  ></path></symbol><symbol id="icon-xiayiqu" viewBox="0 0 1024 1024"><path d="M783.42 177.98c-16.57 0-30 13.43-30 30v608.04c0 16.57 13.43 30 30 30s30-13.43 30-30V207.98c0-16.57-13.43-30-30-30zM340.65 131.5c-20.76-20.75-54.53-20.75-75.28 0a29.997 29.997 0 0 0-8.79 21.21v718.58c0 7.96 3.16 15.59 8.79 21.21 10.38 10.38 24.01 15.57 37.64 15.57 13.63 0 27.26-5.19 37.64-15.57l342.86-342.86c10.05-10.05 15.59-23.42 15.59-37.64 0-14.22-5.54-27.59-15.59-37.64L340.65 131.5z m-24.07 700.22V192.28L636.3 512 316.58 831.72z"  ></path></symbol><symbol id="icon-shangyiqu" viewBox="0 0 1024 1024"><path d="M286.58 177.98c16.57 0 30 13.43 30 30v608.04c0 16.57-13.43 30-30 30s-30-13.43-30-30V207.98c0-16.57 13.43-30 30-30zM729.35 131.5c20.76-20.75 54.53-20.75 75.28 0a29.997 29.997 0 0 1 8.79 21.21v718.58c0 7.96-3.16 15.59-8.79 21.21-10.38 10.38-24.01 15.57-37.64 15.57-13.63 0-27.26-5.19-37.64-15.57L386.49 549.64c-10.05-10.05-15.59-23.42-15.59-37.64 0-14.22 5.54-27.59 15.59-37.64L729.35 131.5z m24.07 700.22V192.28L433.7 512l319.72 319.72z"  ></path></symbol></svg>',
    n = (n = document.getElementsByTagName('script'))[
      n.length - 1
    ].getAttribute('data-injectcss'),
    d = function (c, t) {
      t.parentNode.insertBefore(c, t);
    };
  if (n && !c.__iconfont__svg__cssinject__) {
    c.__iconfont__svg__cssinject__ = !0;
    try {
      document.write(
        '<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>',
      );
    } catch (c) {
      console && console.log(c);
    }
  }
  function s() {
    i || ((i = !0), o());
  }
  function h() {
    try {
      a.documentElement.doScroll('left');
    } catch (c) {
      return void setTimeout(h, 50);
    }
    s();
  }
  (t = function () {
    var c, t;
    ((t = document.createElement('div')).innerHTML = l),
      (l = null),
      (c = t.getElementsByTagName('svg')[0]) &&
        (c.setAttribute('aria-hidden', 'true'),
        (c.style.position = 'absolute'),
        (c.style.width = 0),
        (c.style.height = 0),
        (c.style.overflow = 'hidden'),
        (t = c),
        (c = document.body).firstChild ? d(t, c.firstChild) : c.appendChild(t));
  }),
    document.addEventListener
      ? ~['complete', 'loaded', 'interactive'].indexOf(document.readyState)
        ? setTimeout(t, 0)
        : ((e = function () {
            document.removeEventListener('DOMContentLoaded', e, !1), t();
          }),
          document.addEventListener('DOMContentLoaded', e, !1))
      : document.attachEvent &&
        ((o = t),
        (a = c.document),
        (i = !1),
        h(),
        (a.onreadystatechange = function () {
          a.readyState == 'complete' && ((a.onreadystatechange = null), s());
        }));
})(window);
