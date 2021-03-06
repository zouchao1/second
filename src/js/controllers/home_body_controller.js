import home_body_template from '../views/home_body.html';
import home_body_menu_template from '../views/home_body_menu.html'
import home_body_menu_model from '../models/home_body_model';

import home_body_food_template from '../views/home_body_food.html'
import home_body_food_model from '../models/home_body_food_model';

import BScroll from 'better-scroll';

const render = () => {
    $(document).ready(function () {
        var mySwiper = new Swiper('.swiper-container', {
            autoplay: true, //可选选项，自动滑动
            loop: true
        })
    })


    let _template = Handlebars.compile(home_body_template);
    let _html = _template();
    $('main').html(_html);
    getMenuList()
    handleBodyScroll()
  

}

const handleBodyScroll = async () => {
    let _body_scroll = new BScroll('main', {
        probeType: 2
    });
    $(".scroll_top").on('tap',function(){
        _body_scroll.scrollTo(0, 0, 300);
     })
    await getFoodList();
    _body_scroll.refresh();

    let _o_scroll_info_bottom = $('.scroll-info--bottom') // 下拉刷新的dom元素
    let _o_scroll_info_bottom_title = _o_scroll_info_bottom.find('.scroll-info__title') // 下拉刷新的文字dom
    let _scroll_bottom_sta = false;
    _body_scroll.on('scroll', ({
        x,
        y
    }) => {
        if (_body_scroll.maxScrollY - y > 0) {
            _scroll_bottom_sta = true;
            _o_scroll_info_bottom_title.html('放开去加载')
        }
    })

    _body_scroll.on('scrollEnd', async ({
        x,
        y
    }) => {
        if (y < -1000) {
            $(".scroll_top").css("display", "block")
        } else {
            $(".scroll_top").css("display", "none")
        }
        if (_body_scroll.maxScrollY - y === 0 && _scroll_bottom_sta) {

            _o_scroll_info_bottom_title.html('正在加载')
            _o_scroll_info_bottom.addClass('loading')
            await getFoodList();
            _o_scroll_info_bottom_title.html('上拉去加载')
            _o_scroll_info_bottom.removeClass('loading')
            _body_scroll.refresh()

        }
    })

}

const getMenuList = async () => {
    let _body_menu_data = await home_body_menu_model.home_body_menu_list();
    let _body_menu_list = _body_menu_data[0].entries;
    let _template = Handlebars.compile(home_body_menu_template);
    let _html = _template({
        _body_menu_list
    });
    $("section .meun").html(_html);

}

const getFoodList = async () => {
    let _body_food_data = await home_body_food_model.home_body_food_list();

    let _body_food_list = _body_food_data.items;
    let _template = Handlebars.compile(home_body_food_template);

    let _html = _template({
        _body_food_list
    });

    $("section .food").append(_html);

}

export default {
    render
}