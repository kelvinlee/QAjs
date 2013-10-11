// Generated by CoffeeScript 1.6.3
var QAjs;

QAjs = (function() {
  function QAjs() {}

  QAjs.prototype.HTML = {
    bk: '<div>',
    box: '<form>',
    title: '<p>',
    label: '<label>',
    input: '<input>'
  };

  QAjs.prototype.now = 0;

  QAjs.prototype.myAnswer = [];

  QAjs.prototype.qa = [];

  QAjs.prototype.ep = false;

  QAjs.prototype.init = function(e, data) {
    var $n;
    $n = data.length;
    this.qa = data;
    this.ep = e;
    return this.ep.html(this.showQ());
  };

  QAjs.prototype.createQ = function(qdata, adata) {
    var $a, $box, $input, $this, $title, a, myA, myAp, myselect, _i, _j, _len, _len1, _ref;
    if (adata == null) {
      adata = false;
    }
    console.log(adata);
    $box = $(this.HTML.box);
    $title = $(this.HTML.title).append(qdata.q);
    $box.append($title);
    $this = this;
    _ref = qdata.a;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      a = _ref[_i];
      $input = $(this.HTML.input).attr({
        'type': qdata.type,
        'id': qdata.type === 'radio' ? this.now + "r" : this.now + "r" + _i,
        'name': qdata.type === 'radio' ? this.now + "r" : this.now + "r" + _i,
        'value': this.now + "r" + _i
      });
      $a = $(this.HTML.label).append($input);
      $a.append(a.title);
      $box.append($a);
      if (!adata) {
        $input.click(function() {
          return $this.showNext();
        });
      } else {
        $input.attr('disabled', 'true');
        if (a.right) {
          $a.addClass('right');
        }
      }
    }
    if (adata) {
      for (_j = 0, _len1 = adata.length; _j < _len1; _j++) {
        myA = adata[_j];
        myAp = myA.value.split('r');
        myselect = $box.find('input:eq(' + myAp[1] + ')');
        myselect.attr('checked', 'checked');
        if (!myselect.parent().is('.right')) {
          myselect.parent().addClass('wrong');
        }
      }
    }
    return $box;
  };

  QAjs.prototype.createEnd = function() {
    var $bk, $box, $qalist, $r, $title, a, qd, _i, _j, _len, _ref;
    $qalist = this.checkQ();
    $r = 0;
    for (_i = 0, _len = $qalist.length; _i < _len; _i++) {
      a = $qalist[_i];
      if (a) {
        $r += a;
      }
    }
    $box = $(this.HTML.box);
    $title = $(this.HTML.title).append('答题结束. (得分:' + $r + ') <br/> 绿色为正确答案,红色是错误答案.');
    $box.append($title);
    $bk = $(this.HTML.bk);
    for (qd = _j = 0, _ref = this.qa.length; 0 <= _ref ? _j < _ref : _j > _ref; qd = 0 <= _ref ? ++_j : --_j) {
      $bk.append(this.createQ(this.qa[qd], this.myAnswer[qd]));
    }
    this.now = -1;
    $bk.append($box);
    return $bk;
  };

  QAjs.prototype.settlement = function() {
    return this.myAnswer[this.now] = $(this.ep).find("form").serializeArray();
  };

  QAjs.prototype.showQ = function() {
    if (this.now === this.qa.length) {
      return this.createEnd();
    } else {
      return this.createQ(this.qa[this.now]);
    }
  };

  QAjs.prototype.showNext = function() {
    var $next, $prev, $submit, $this;
    $this = this;
    if (this.now === -1) {
      return false;
    }
    if (!this.ep) {
      return true;
    }
    if (this.now && this.ep.find('#preBtn').length <= 0) {
      $prev = $('<input type="button" id="preBtn" value="Prev">');
      $prev.click(function() {
        $this.settlement();
        $this.now--;
        return $this.ep.html($this.showQ());
      });
      this.ep.append($prev);
    }
    if (this.ep.find('#nextBtn').length <= 0 && this.now < this.qa.length - 1) {
      $next = $('<input type="button" id="nextBtn" value="Next">');
      $next.click(function() {
        $this.settlement();
        $this.now++;
        return $this.ep.html($this.showQ());
      });
      this.ep.append($next);
    }
    if (this.now >= this.qa.length - 1 && this.ep.find('#submitBtn').length <= 0) {
      $submit = $('<input type="button" id="submitBtn" value="Submit">');
      $submit.click(function() {
        $this.settlement();
        $this.now++;
        return $this.ep.html($this.showQ());
      });
      this.ep.append($submit);
    }
    return true;
  };

  QAjs.prototype.checkQ = function() {
    var $boxlist, a, ans, myA, myAp, n, _i, _j, _k, _len, _len1, _ref, _ref1, _ref2;
    $boxlist = [];
    _ref = this.qa;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      a = _ref[_i];
      n = 0;
      for (ans = _j = 0, _ref1 = a.a.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; ans = 0 <= _ref1 ? ++_j : --_j) {
        if (a.a[ans].right) {
          n++;
        }
      }
      this.myAnswer[_i].right = false;
      if (this.myAnswer[_i].length === n) {
        this.myAnswer[_i].right = true;
        _ref2 = this.myAnswer[_i];
        for (_k = 0, _len1 = _ref2.length; _k < _len1; _k++) {
          myA = _ref2[_k];
          myAp = myA.value.split('r');
          if (!this.qa[parseInt(myAp[0])].a[parseInt(myAp[1])].right) {
            this.myAnswer[_i].right = false;
          }
        }
      }
      if (this.myAnswer[_i].right) {
        $boxlist[_i] = a.fraction;
      } else {
        $boxlist[_i] = 0;
      }
    }
    return $boxlist;
  };

  return QAjs;

})();