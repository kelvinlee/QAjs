# jQuery plugins QAjs

class QAjs
	HTML: 
		bk: '<div>'
		box : '<form>'
		title: '<p>'
		label: '<label>'
		input : '<input>'
	now: 0
	myAnswer:[]
	qa:[]
	ep : false
	init: (e,data)->
		$n = data.length
		this.qa = data
		this.ep = e
		this.ep.html this.showQ()
	createQ: (qdata , adata = false)->
		console.log adata
		$box = $ this.HTML.box
		$title = $(this.HTML.title).append qdata.q
		$box.append $title
		$this = this
		for a in qdata.a
			$input = $(this.HTML.input).attr 
				'type':qdata.type
				'id': if qdata.type is 'radio' then this.now+"r" else this.now+"r"+_i
				'name': if qdata.type is 'radio' then this.now+"r" else this.now+"r"+_i
				'value': this.now+"r"+_i
			$a = $(this.HTML.label).append $input
			$a.append a.title
			$box.append $a
			# 增加答案判断
			if not adata
				$input.click ->
					$this.showNext()
			else
				$input.attr 'disabled','true'
				if a.right
					$a.addClass 'right'
				
		if adata
			for myA in adata
				myAp = myA.value.split 'r'
				myselect = $box.find 'input:eq('+myAp[1]+')'
				myselect.attr 'checked','checked'
				if not myselect.parent().is '.right'
					myselect.parent().addClass 'wrong'
		$box
	createEnd: ->
		$qalist = this.checkQ()
		$r = 0
		for a in $qalist
			if a
				$r += a
		$box = $ this.HTML.box
		$title = $(this.HTML.title).append '答题结束. (得分:'+$r+') <br/> 绿色为正确答案,红色是错误答案.'
		$box.append $title
		$bk = $ this.HTML.bk 
		for qd in [0...this.qa.length]
			$bk.append this.createQ this.qa[qd],this.myAnswer[qd]

		this.now = -1
		$bk.append $box
		$bk
		
	settlement: ()->
		this.myAnswer[this.now] = $(this.ep).find("form").serializeArray()
	showQ: -> 
		if this.now is this.qa.length
			this.createEnd()
		else
			this.createQ this.qa[this.now]

	showNext: ()-> 
		$this = this
		return false if this.now is -1
		if !this.ep
			return yes
		if this.now and this.ep.find('#preBtn').length<=0
			$prev = $ '<input type="button" id="preBtn" value="Prev">'
			$prev.click ->
				$this.settlement()
				$this.now--
				$this.ep.html $this.showQ()
			this.ep.append $prev

		if this.ep.find('#nextBtn').length<=0 and this.now < this.qa.length - 1
			$next = $ '<input type="button" id="nextBtn" value="Next">'
			$next.click ->
				$this.settlement()
				$this.now++
				$this.ep.html $this.showQ()
			this.ep.append $next
		
		if this.now >= this.qa.length - 1 and this.ep.find('#submitBtn').length<=0
			$submit = $ '<input type="button" id="submitBtn" value="Submit">'
			$submit.click ->
				$this.settlement()
				$this.now++
				$this.ep.html $this.showQ()
			this.ep.append $submit
		yes
	# 计算答对得分.
	checkQ: ()->
		$boxlist = []
		for a in this.qa 
			n = 0 
			for ans in [0...a.a.length]
				n++ if a.a[ans].right  
			this.myAnswer[_i].right = false
			if this.myAnswer[_i].length is n
				this.myAnswer[_i].right = true 
				for myA in this.myAnswer[_i]
					myAp = myA.value.split 'r' 
					if not this.qa[parseInt(myAp[0])].a[parseInt(myAp[1])].right
						this.myAnswer[_i].right = false 
			if this.myAnswer[_i].right
				$boxlist[_i] = a.fraction
			else
				$boxlist[_i] = 0

		$boxlist
				



