function initFormScript() {
	let beanSource = document.querySelectorAll('[data-name]')
    const form = document.getElementById('form')
    generateStructureBean(form)
    beanSource.forEach(source => {
        if (source.dataset.controlType === 'radio' || source.dataset.controlType === 'checkbox') {
            $(source).find('input').each(function() {
                this.addEventListener('click', triggerChecked)
            })
        }
        if (source.dataset.script !== undefined) {
            let script = JSON.parse(source.dataset.script)
            for(let key in script) {
                switch (script[key].type) {
                    case 'disabled':
                        $(source).find('input').each(function() {
                            if (this.parentElement.parentElement === source)
                                this.addEventListener('click', clickEventDisabled)
                        })
                        break
                    case 'display':
                        $(source).find('input').each(function() {
                            if (this.parentElement.parentElement === source)
                                this.addEventListener('click', clickEventDisplay)
                        })
                        break
                    case 'address':
                        $(source).find('input').each(function() {
                            if (this.parentElement.parentElement === source)
                                this.addEventListener('click', clickEventAddress)
                        })
                        break
                    case 'bmi':
                        if ($('[data-name="height"]').length === 0) console.error('無法計算BMI，找不到元件height')
                        if ($('[data-name="weight"]').length === 0) console.error('無法計算BMI，找不到元件weight')
                        if ($('[data-name="bmi"]').length === 0) console.error('無法計算BMI，找不到元件bmi')
                        if ($('[data-name="height"]').length > 0 && $('[data-name="weight"]').length > 0) {
                            $('[data-name="height"]').find('input')[0].addEventListener('blur', blurEventBMI)
                            $('[data-name="weight"]').find('input')[0].addEventListener('blur', blurEventBMI)
                        }
                        break
                }
            }
        }
        if (source.dataset.uiScore !== undefined) {
            $(source).find('input').each(function() {
                if (this.parentElement.parentElement === source)
                    this.addEventListener('click', clickEventScore)
            })
        }
    })
}

function clickEventScore(e) {
    let chk         = e.target.checked
    let targetScore = e.target.dataset.score
    let beanDiv     = $(e.target).parent().parent()
    let scoreBean   = beanDiv.data('scoreBean')
    let score       = $(`[data-name="${ scoreBean }"]`)
    let scoreRule   = $(`[data-name="${ scoreBean }"]`).data('scoreRule')
    let totalScore  = 0
    try {
        scoreRule = JSON.parse(scoreRule)
    } catch (e) {
    }
    $(`[data-score-bean="${ scoreBean }"]`).each(function(index) {
        $(this).find('input:checked').each(function() {
            if (this !== e.target)
                totalScore += ($(this).data('score') - 0)
        })
    })
    if (chk) {
        totalScore += targetScore - 0
    } else {
        totalScore -= targetScore - 0
    }
    if (scoreRule !== undefined) {
        for (let key in scoreRule) {
            let minLimit = scoreRule[key]["min-limit"] - 0
            let maxLimit = scoreRule[key]["max-limit"] - 0
            let warning  = scoreRule[key]["warning-text"]
            let color    = scoreRule[key]["rule-color"] || scoreRule[key]["ruleColor"]
            if (totalScore > minLimit && totalScore <= maxLimit) {
                score.find('label').text(totalScore + (warning !== '' ? '  ' : '') + warning).css('color', color)
                break
            }
        }
    } else {
        score.find('label').text(totalScore)
    }
}

function clickEventDisabled(e) {
    let chk         = e.target.checked
    let position    = $(e.target).parent().index()
    let beanDiv     = $(e.target).parent().parent()
    let script      = beanDiv.data('script')
    let options     = []
    try {
        script = JSON.parse(script)
    } catch (e) {
    }
    for (let key in script) {
        if (script[key].type === 'disabled') {
            options = script[key].options
            break
        }
    }
    if (chk && options.indexOf(position) > -1) {
        beanDiv.find('input').attr('disabled', 'disabled')
        $(e.target).attr('disabled', null)
    } else {
        beanDiv.find('input').attr('disabled', null)
    }
}

function clickEventDisplay(e) {
    let chk         = e.target.checked
    let position    = $(e.target).parent().index()
    let beanDiv     = $(e.target).parent().parent()
    let script      = beanDiv.data('script')
    try {
        script = JSON.parse(script)
    } catch (e) {
    }
    $('.nav-link').removeClass('hide')
    $('.tab-pane').removeClass('hide')
    $('.tab-pane.active').find('table td').removeClass('hide')
    $('[data-show="false"]').addClass('hide')
    for (let key in script) {
        if (script[key].type === 'display') {
            options = script[key].options
            if (chk && options.indexOf(position) > -1) {
                for (let i = 0; i < script[key].range.length; i++) {
                    let hideTab  = script[key].range[i].hideTab
                    let tabIndex = script[key].range[i].tabIndex
                    let hideArr  = script[key].range[i].hidePosition
                    let hideBean = script[key].range[i].hideBeanName
                    let showBean = script[key].range[i].showBeanName
                    if (hideTab) {
                        $('.nav-link').eq(tabIndex).addClass('hide')
                        $('.tab-pane').eq(tabIndex).addClass('hide')
                        break
                    }
                    for (let j = 0; j < hideArr.length; j++) {
                        $('.tab-pane').eq(tabIndex).find('table tr').eq(hideArr[j].y).find('td').eq(hideArr[j].x).addClass('hide')
                    }
                    for (let j = 0; j < hideBean.length; j++) {
                        $(`[data-name="${ hideBean[j] }"]`).addClass('hide')
                    }
                    for (let j = 0; j < showBean.length; j++) {
                        $(`[data-name="${ showBean[j] }"]`).removeClass('hide')
                    }
                }
            }
        }
    }
}

function clickEventAddress(e) {
    let chk         = e.target.checked
    let position    = $(e.target).parent().index()
    let beanDiv     = $(e.target).parent().parent()
    let script      = beanDiv.data('script')
    try {
        script = JSON.parse(script)
    } catch (e) {
    }
    for (let key in script) {
        if (script[key].type === 'address') {
            if (chk && script[key].options.indexOf(position) > -1) {
                let thisAddress = beanDiv.parent()
                $(`[data-control-type="addressTW"]`).each(function(index) {
                    if (this === thisAddress[0]) return
                    $(this).find('[data-is-address="true"]').each(function(p) {
                        thisAddress.find('[data-is-address="true"]').eq(p).val($(this).val())
                    })
                })
            }
            break
        }
    }
}

function blurEventBMI(e) {
    let height  = $('[data-name="height"]').find('input').eq(0).val()
    let weight  = $('[data-name="weight"]').find('input').eq(0).val()
    if (height === "" || weight === "") return
    let BMI     = Math.round(weight / Math.pow((height * 0.01)))
    $('[data-name="bmi"]').find('input').eq(0).val(BMI)
}

function triggerChecked(e) {
    let realchk = e.target.dataset.isCheck || 'false'
    if (!e.target.checked && realchk === 'true') {
        e.target.checked            = false
        e.target.dataset.isCheck    = false
    } else {
        e.target.dataset.isCheck    = true
        e.target.checked            = true
    }
    let chk = e.target.checked
    if (chk) {
        if ($(e.target).parent().find('[data-is-bean="Y"]').length > 0) {
            $(e.target).parent().find('[data-is-bean="Y"]').each(function(index) {
                if (this.parentElement === e.target.parentElement) {
                    $(this).removeClass('view-hide')
                }
            })
        }
    } else {
        $(e.target).parent().find('[data-is-bean="Y"]').each(function(index) {
            $(this).addClass('view-hide')
            $(this).find('input').attr('checked', null)
            $(this).find('input[type="text"]').val('')
            $(this).find('textarea').val('')
        })
    }
}

function addGroupItems(that) {
    let groupName = that.dataset.groupName
    const groupBean = $(`[data-name="${ groupName }"]`)
    let structure = groupBean.data('structure')
    if (structure !== undefined) {
        try {
            structure = JSON.parse(structure)
        } catch (e) { }
        processGroupData(structure)
        let eleArray = structure.createElemental()
        eleArray.forEach(element => {
            element.dataset.groupName = groupName
        })
        const buttonDel = CreateUtils.createBeanElement({
            'controlType': 'button',
            'attribute':    [
                {
                    'name': `${ $(that).attr('name') }_groupBtnDel`,
                    'text': '',
                    'class': 'btn btn-danger',
                    'onclick': `removeGroupItems(this);return false`,
                    'data-group-name': groupName
                }
            ]
        })
        $(buttonDel).append(CreateUtils.createBeanElement({
            'controlType': 'i',
            'attribute': 	[
                {
                    'class': 'bi bi-dash'
                }
            ]
        }))
        const groupItemDiv = CreateUtils.createBeanElement({
            'controlType': 'div',
            'attribute':    [
                {
                    'class': 'groupItem'
                }
            ]
        })
        $(groupItemDiv).append(buttonDel).append(eleArray)
        generateStructureBean(groupItemDiv[0])
        groupBean.append(groupItemDiv)
    }

    function processGroupData(jsonObject) {
        for (let key in jsonObject) {
			if (Array.isArray(jsonObject)) {
				processGroupData(jsonObject[key])
			} else {
				switch (key) {
					case 'name':
						jsonObject[key] += `_child_${ new Date().format('HHmmssS') }`
						break
					case 'id':
						jsonObject[key] = SharedUtils._uuid()
						break
				}
				if (typeof jsonObject[key] === 'object') {
					processGroupData(jsonObject[key])
				}
			}
		}
    }
}

function removeGroupItems(that) {
    $(that).parent().remove()
}
