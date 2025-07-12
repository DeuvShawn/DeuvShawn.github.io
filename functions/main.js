// JavaScript代码部分 - 实现页面的交互功能

// 获取DOM元素的引用
// getElementById()用于通过ID获取单个元素
const searchInput = document.getElementById('searchInput');
const noResults = document.getElementById('noResults');
const bookmarksGrid = document.getElementById('bookmarksGrid');

// querySelectorAll()用于获取所有匹配的元素，返回NodeList
const filterTabs = document.querySelectorAll('.filter-tab');
const bookmarkCards = document.querySelectorAll('.bookmark-card');

// 获取搜索栏元素
const searchBar = document.querySelector('.search-bar');

// 全局变量，用于跟踪当前的筛选状态
let currentFilter = 'all';      // 当前选中的分类
let currentSearch = '';         // 当前的搜索关键词

// 添加聚焦事件监听器 - 点击输入框时展开
searchInput.addEventListener('focus', function () {
  searchBar.classList.add('expanded');
});

// 添加失焦事件监听器 - 失去焦点时收缩
searchInput.addEventListener('blur', function () {
  // 如果搜索框为空，则收缩回原始大小
  if (this.value.trim() === '') {
    searchBar.classList.remove('expanded');
  }
});

// 排序函数
function sortBookmarkCards(sortBy = 'favicon', order = 'asc') {
  const cards = Array.from(bookmarksGrid.querySelectorAll('.bookmark-card'));

  // 更新按钮状态
  updateActiveButton(sortBy + '-' + order);

  setTimeout(() => {
    // 执行排序
    cards.sort((a, b) => {
      let textA, textB;

      switch (sortBy) {
        case 'favicon':
          textA = a.querySelector('.bookmark-favicon').textContent.trim();
          textB = b.querySelector('.bookmark-favicon').textContent.trim();
          break;
        case 'category':
          textA = a.querySelector('.bookmark-category').textContent.trim();
          textB = b.querySelector('.bookmark-category').textContent.trim();
          break;
        default:
          textA = a.querySelector('.bookmark-favicon').textContent.trim();
          textB = b.querySelector('.bookmark-favicon').textContent.trim();
      }

      const comparison = textA.localeCompare(textB, 'zh-CN', { numeric: true });
      return order === 'asc' ? comparison : -comparison;
    });

    // 清空容器
    bookmarksGrid.innerHTML = '';

    // 重新插入排序后的卡片
    cards.forEach((card, index) => {
      card.classList.remove('sorting');
      card.classList.add('sorting-enter');
      bookmarksGrid.appendChild(card);

      // 延迟添加动画效果
      setTimeout(() => {
        card.classList.remove('sorting-enter');
        card.classList.add('sorting-enter-active');
      }, index * 50);

      // 清理动画类
      setTimeout(() => {
        card.classList.remove('sorting-enter-active');
      }, 500 + index * 50);
    });
  });
}

// 更新按钮激活状态
function updateActiveButton(sortType) {
  const buttons = document.querySelectorAll('.sort-btn');
  buttons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.sort === sortType) {
      btn.classList.add('active');
    }
  });
}

// 页面加载完成后自动排序
document.addEventListener('DOMContentLoaded', function () {
  // 默认按字母A-Z排序
  sortBookmarkCards('favicon', 'asc');
});


// 搜索功能实现
// addEventListener()用于添加事件监听器
searchInput.addEventListener('input', function () {
  // this指向触发事件的元素（搜索输入框）
  // toLowerCase()转换为小写，实现不区分大小写的搜索
  currentSearch = this.value.toLowerCase();

  // 调用筛选函数更新显示
  filterBookmarks();
});

// 分类筛选功能实现
// forEach()遍历每个筛选标签
filterTabs.forEach(tab => {
  tab.addEventListener('click', function () {
    // 移除所有标签的活动状态
    filterTabs.forEach(t => t.classList.remove('active'));

    // 为当前点击的标签添加活动状态
    this.classList.add('active');

    // 获取当前标签的分类数据
    // dataset用于访问data-*属性
    currentFilter = this.dataset.category;

    // 调用筛选函数更新显示
    filterBookmarks();
  });
});

// 筛选函数 - 根据搜索关键词和分类筛选来显示/隐藏卡片
function filterBookmarks() {
  let visibleCount = 0;  // 记录可见卡片数量

  // 遍历每个收藏卡片
  bookmarkCards.forEach(card => {
    // 获取卡片的标题和描述文本
    // querySelector()获取第一个匹配的子元素
    const title = card.querySelector('.bookmark-title').textContent.toLowerCase();
    const description = card.querySelector('.bookmark-description').textContent.toLowerCase();
    const category = card.dataset.category;

    // 检查是否匹配搜索关键词
    // includes()检查字符串是否包含指定的子字符串
    const matchesSearch = title.includes(currentSearch) || description.includes(currentSearch);

    // 检查是否匹配分类筛选
    const matchesCategory = currentFilter === 'all' || category === currentFilter;

    // 如果同时匹配搜索和分类条件，则显示卡片
    if (matchesSearch && matchesCategory) {
      card.style.display = 'block';  // 显示卡片
      visibleCount++;                // 增加可见卡片计数
    } else {
      card.style.display = 'none';   // 隐藏卡片
    }
  });

  // 根据可见卡片数量决定是否显示"无结果"提示
  if (visibleCount === 0) {
    noResults.style.display = 'block';   // 显示无结果提示
  } else {
    noResults.style.display = 'none';    // 隐藏无结果提示
  }
}

// 为收藏卡片添加鼠标悬停效果
bookmarkCards.forEach(card => {
  // 鼠标进入时的效果
  card.addEventListener('mouseenter', function () {
    // 同时应用向上移动和轻微放大的变换效果
    this.style.transform = 'translateY(-5px) scale(1.02)';
  });

  // 鼠标离开时恢复原状
  card.addEventListener('mouseleave', function () {
    this.style.transform = 'translateY(0) scale(1)';
  });
});