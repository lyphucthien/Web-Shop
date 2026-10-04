(function(){
  var ARTICLES = [
    {
      id:"khai-truong-lptshop", cat:"Thông báo", date:"2026-10-01", emoji:"🎉",
      title:"LPTSHOP chính thức khai trương",
      summary:"LPTSHOP - hệ thống bán acc đa loại game: đúng mô tả, an tâm trải nghiệm, bảo mật 100%.",
      content:[
        "Chào mừng bạn đến với LPTSHOP - hệ thống bán acc đa loại game với cam kết đúng mô tả, giá cả phải chăng, chất lượng và an toàn.",
        "Bạn có thể mua hàng, nạp tiền và theo dõi cấp bậc VIP ngay trên website. Mọi thắc mắc vui lòng liên hệ qua thông tin ở cuối trang."
      ]
    },
    {
      id:"tui-mu-blox-fruit", cat:"Sự kiện", date:"2026-09-28", emoji:"🎁",
      title:"Túi Mù BLOX FRUIT - 100% Acc quốc tế",
      summary:"Mở túi mù Blox Fruit, nhận ngay acc quốc tế ngẫu nhiên trong mỗi lượt mở.",
      content:[
        "Túi Mù BLOX FRUIT là sản phẩm mới tại LPTSHOP, mỗi túi đều là acc quốc tế.",
        "Bạn có thể xem và mua tại mục sản phẩm ở trang chủ."
      ]
    },
    {
      id:"he-thong-cap-bac-vip", cat:"Cập nhật", date:"2026-09-25", emoji:"👑",
      title:"Hệ thống cấp bậc VIP: nạp càng nhiều, ưu đãi càng lớn",
      summary:"Từ Thành Viên lên Đồng, Bạc, Vàng, Kim Cương, Cao Cấp - mỗi cấp một quyền lợi riêng.",
      content:[
        "Cấp bậc của bạn tăng dần theo tổng số tiền đã nạp: Thành Viên, Đồng, Bạc, Vàng, Kim Cương và Cao Cấp.",
        "Cấp càng cao, ưu đãi càng lớn: giảm giá khi mua, voucher khi lên hạng, ưu tiên xử lý đơn và nhiều quyền lợi khác.",
        "Xem chi tiết quyền lợi từng cấp tại mục CẤP BẬC trên thanh menu."
      ]
    },
    {
      id:"huong-dan-nap-tien", cat:"Hướng dẫn", date:"2026-09-20", emoji:"💳",
      title:"Hướng dẫn nạp tiền vào tài khoản",
      summary:"Nạp bằng thẻ cào hoặc chuyển khoản, số dư cộng vào tài khoản của bạn.",
      content:[
        "LPTSHOP hỗ trợ 2 hình thức nạp tiền: nạp thẻ cào và chuyển khoản.",
        "Bước 1: Đăng nhập tài khoản. Bước 2: Vào mục NẠP TIỀN trên thanh menu và chọn hình thức nạp. Bước 3: Làm theo hướng dẫn trên màn hình.",
        "Nếu nạp xong chưa thấy số dư, hãy liên hệ hỗ trợ kèm thông tin giao dịch."
      ]
    },
    {
      id:"huong-dan-mua-hang", cat:"Hướng dẫn", date:"2026-09-15", emoji:"🛒",
      title:"Hướng dẫn mua acc tại LPTSHOP",
      summary:"Chọn sản phẩm, thanh toán bằng số dư và nhận thông tin acc ngay sau khi mua.",
      content:[
        "Chọn sản phẩm bạn muốn ở trang chủ, kiểm tra kỹ mô tả rồi bấm mua.",
        "Đảm bảo tài khoản của bạn đủ số dư. Sau khi mua, thông tin acc sẽ hiển thị cho bạn."
      ]
    },
    {
      id:"bao-tri-he-thong", cat:"Thông báo", date:"2026-09-10", emoji:"🛠️",
      title:"Thông báo bảo trì hệ thống định kỳ",
      summary:"Trong lúc bảo trì, một số chức năng có thể tạm thời gián đoạn trong thời gian ngắn.",
      content:[
        "Để hệ thống hoạt động ổn định hơn, LPTSHOP sẽ bảo trì định kỳ khi cần thiết.",
        "Trong thời gian này một số chức năng có thể tạm thời gián đoạn. Cảm ơn bạn đã thông cảm!"
      ]
    },
    {
      id:"bao-mat-tai-khoan", cat:"Hướng dẫn", date:"2026-09-05", emoji:"🔒",
      title:"Cách bảo vệ tài khoản LPTSHOP của bạn",
      summary:"Vài lưu ý nhỏ giúp tài khoản luôn an toàn: mật khẩu, thông tin đăng nhập và liên hệ hỗ trợ.",
      content:[
        "Không chia sẻ mật khẩu hoặc mã xác nhận cho bất kỳ ai, kể cả người tự nhận là nhân viên.",
        "Chỉ đăng nhập trên website chính thức của LPTSHOP và đặt mật khẩu đủ mạnh.",
        "Nếu nghi ngờ tài khoản bị lộ, hãy đổi mật khẩu ngay và liên hệ hỗ trợ."
      ]
    }
  ];

  var CATS = ["Tất cả","Thông báo","Sự kiện","Cập nhật","Hướng dẫn"];
  var PER_PAGE = 6;

  var state = { cat:"Tất cả", q:"", shown:PER_PAGE };

  function $(id){ return document.getElementById(id); }
  function esc(s){
    return String(s).replace(/[&<>"']/g,function(c){
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
    });
  }
  function fmtDate(d){
    var p = String(d).split("-");
    return p.length===3 ? p[2]+"/"+p[1]+"/"+p[0] : esc(d);
  }
  function norm(s){
    return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d");
  }

  var sorted = ARTICLES.slice().sort(function(a,b){ return a.date < b.date ? 1 : -1; });

  function thumb(a){
    return '<div class="news-thumb" data-cat="'+esc(a.cat)+'">'+
      (a.img ? '<img src="'+esc(a.img)+'" alt="" loading="lazy" onerror="this.remove()">' : '')+
      '<span class="news-emoji">'+(a.emoji||"📰")+'</span></div>';
  }

  function filtered(){
    var q = norm(state.q.trim());
    return sorted.filter(function(a){
      if(state.cat!=="Tất cả" && a.cat!==state.cat) return false;
      return !q || norm(a.title+" "+a.summary).indexOf(q)!==-1;
    });
  }

  function renderChips(){
    $("newsChips").innerHTML = CATS.map(function(c){
      return '<button type="button" class="news-chip'+(c===state.cat?" active":"")+'" data-cat="'+esc(c)+'">'+esc(c)+'</button>';
    }).join("");
  }

  function render(){
    var list = filtered();
    var feat = list[0];
    var rest = list.slice(1);
    var visible = rest.slice(0, state.shown);

    $("newsFeatured").innerHTML = feat ?
      '<article class="news-featured" data-id="'+esc(feat.id)+'" tabindex="0" role="button">'+
        thumb(feat)+
        '<div class="news-body" data-cat="'+esc(feat.cat)+'">'+
          '<span class="news-tag">'+esc(feat.cat)+'</span>'+
          '<h2>'+esc(feat.title)+'</h2>'+
          '<p>'+esc(feat.summary)+'</p>'+
          '<div class="news-meta"><time>'+fmtDate(feat.date)+'</time><span class="news-more-link">Đọc tiếp →</span></div>'+
        '</div>'+
      '</article>' : "";

    $("newsGrid").innerHTML = visible.map(function(a){
      return '<article class="news-card" data-id="'+esc(a.id)+'" tabindex="0" role="button">'+
        thumb(a)+
        '<div class="news-body" data-cat="'+esc(a.cat)+'">'+
          '<span class="news-tag">'+esc(a.cat)+'</span>'+
          '<h3>'+esc(a.title)+'</h3>'+
          '<p>'+esc(a.summary)+'</p>'+
          '<div class="news-meta"><time>'+fmtDate(a.date)+'</time><span class="news-more-link">Đọc tiếp →</span></div>'+
        '</div>'+
      '</article>';
    }).join("");

    $("newsEmpty").hidden = list.length>0;
    $("newsLoad").hidden = rest.length <= state.shown;
  }

  function openArticle(id){
    var a = ARTICLES.filter(function(x){ return x.id===id; })[0];
    if(!a) return;
    $("newsArticle").innerHTML =
      thumb(a)+
      '<div class="news-article-body" data-cat="'+esc(a.cat)+'">'+
        '<span class="news-tag">'+esc(a.cat)+'</span>'+
        '<h2 id="newsArticleTitle">'+esc(a.title)+'</h2>'+
        '<div class="news-date">Đăng ngày '+fmtDate(a.date)+'</div>'+
        a.content.map(function(p){ return '<p>'+esc(p)+'</p>'; }).join("")+
      '</div>';
    var m = $("newsModal");
    m.classList.add("open");
    m.setAttribute("aria-hidden","false");
    m.scrollTop = 0;
    document.body.style.overflow = "hidden";
    try{ history.replaceState(null,"","#"+id); }catch(e){}
  }

  function closeArticle(){
    var m = $("newsModal");
    m.classList.remove("open");
    m.setAttribute("aria-hidden","true");
    document.body.style.overflow = "";
    try{ history.replaceState(null,"",location.pathname+location.search); }catch(e){}
  }

  $("newsChips").addEventListener("click",function(e){
    var b = e.target.closest(".news-chip");
    if(!b) return;
    state.cat = b.dataset.cat;
    state.shown = PER_PAGE;
    renderChips();
    render();
  });

  $("newsSearch").addEventListener("input",function(){
    state.q = this.value;
    state.shown = PER_PAGE;
    render();
  });

  $("newsLoad").addEventListener("click",function(){
    state.shown += PER_PAGE;
    render();
  });

  function pick(e){
    var el = e.target.closest(".news-card, .news-featured");
    if(el) openArticle(el.dataset.id);
  }
  $("newsFeatured").addEventListener("click",pick);
  $("newsGrid").addEventListener("click",pick);
  [$("newsFeatured"),$("newsGrid")].forEach(function(box){
    box.addEventListener("keydown",function(e){
      if(e.key==="Enter" || e.key===" "){ e.preventDefault(); pick(e); }
    });
  });

  $("newsClose").addEventListener("click",closeArticle);
  $("newsModal").addEventListener("click",function(e){
    if(e.target===this) closeArticle();
  });
  document.addEventListener("keydown",function(e){
    if(e.key==="Escape") closeArticle();
  });

  renderChips();
  render();

  if(location.hash.length>1) openArticle(decodeURIComponent(location.hash.slice(1)));
})();
