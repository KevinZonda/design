import type { ComponentDoc } from './componentRegistry'
import type { ExtraComponentDoc } from './extraComponentRegistry'
import type { Locale } from './i18n'

interface DocTranslation {
  summary: string
  whenToUse: string
  howItWorks: string
}

const componentText: Record<string, DocTranslation> = {
  accordion: { summary: '让用户展开和收起页面中相关的内容区块。', whenToUse: '当用户一次只需查看少量区块，且完整页面难以浏览时使用。若大多数用户都需要阅读全部内容，优先使用普通标题。', howItWorks: '每个区块使用真正的按钮，公开其展开状态，内容始终保留在文档中。包括“全部展开”在内的状态由 React 管理。' },
  'back-link': { summary: '帮助用户返回多页服务中的上一步。', whenToUse: '用于问题页面及其他线性流程。放在主要内容顶部，不要与面包屑导航同时使用。', howItWorks: '组件渲染普通链接，因此仍可使用浏览器的新标签页打开等功能。' },
  breadcrumbs: { summary: '显示用户在网站层级结构中的位置。', whenToUse: '用于包含多级导航的网站。简单的线性事务流程不需要面包屑导航。', howItWorks: '按层级顺序提供条目。当前页面不设置 href，以带有 aria-current 的文字呈现。' },
  button: { summary: '帮助用户执行保存信息或启动服务等操作。', whenToUse: '每页设置一个明确的主要操作。服务起始页使用开始按钮，相关操作可以放在一起。除非用户研究证明有必要，否则避免禁用按钮。', howItWorks: '使用 href 导航，或使用 htmlType 创建原生表单按钮。开始按钮带 GOV.UK 箭头；ButtonGroup 对齐按钮和链接。禁用按钮会设置 disabled 和 aria-disabled；加载中的按钮显示旋转指示器、阻止点击并设置 aria-busy。' },
  'character-count': { summary: '在严格限制字数时告知用户还可以输入多少内容。', whenToUse: '仅在服务确实限制字符数或词数时使用。用户开始输入前应解释限制。', howItWorks: '根据文本框的值计算实时字数，并以非打断方式通知辅助技术。' },
  checkboxes: { summary: '让用户从列表中选择一个或多个选项。', whenToUse: '允许选择多个答案时使用。只能选择一个答案时使用单选按钮。', howItWorks: '每个复选框都有可见标签；选项还可以包含提示文字和条件内容。' },
  'cookie-banner': { summary: '征求用户设置非必要 Cookie 的许可。', whenToUse: '服务使用分析或其他非必要 Cookie 时使用。等待用户选择期间不要阻止其访问服务。', howItWorks: '选择保存在一年期 Cookie 中；确认消息可关闭，回访时不再显示。应用可通过 onConsentChange 获得已保存的选择。' },
  'date-input': { summary: '通过日、月、年字段询问用户熟悉或已知的日期。', whenToUse: '用于出生日期等用户已经知道的日期。只有需要从可选日期中挑选时才使用日历控件。', howItWorks: '三个数字输入框由一个带图例的 fieldset 分组。可用 DMY、MDY、YMD 或 GBR、USA、CHN 别名调整显示顺序；返回值始终是包含日、月、年的对象。' },
  details: { summary: '让次要信息可供查看，而不默认显示。', whenToUse: '用于只有部分用户需要的信息。不要隐藏多数用户完成任务必须阅读的内容。', howItWorks: '使用原生 details 和 summary 元素，因此基本交互无需 JavaScript。' },
  'error-message': { summary: '在相关字段附近告诉用户哪里出错以及如何修正。', whenToUse: '在每个有错字段旁显示，并在错误摘要中重复相同的表述。', howItWorks: '视觉隐藏的前缀确保辅助技术将其读作错误，而不只依靠颜色。' },
  'error-summary': { summary: '在页面顶部汇总验证错误并链接到各个字段。', whenToUse: '验证失败时始终显示错误摘要，即使只有一个错误也一样。', howItWorks: '使用标准标题，链接文字与字段旁错误一致，并在提交失败后将焦点移到摘要。' },
  'exit-this-page': { summary: '为用户提供醒目的入口，快速离开敏感服务。', whenToUse: '在被他人看到可能使用户面临风险的页面使用。说明该控件无法清除浏览器历史记录。', howItWorks: '普通链接可直接退出；启用 JavaScript 后还可通过辅助链接或五秒内连按三次 Shift 退出，跳转前会遮住当前页面。' },
  feedback: { summary: '收集用户对页面的简短反馈和问题报告。', whenToUse: '当团队有能力审阅并处理反馈时，可在服务中使用。不要把它与正式投诉或客服渠道混为一谈。', howItWorks: '简洁的“有用／无用”提问可以在当前页面展开简短的问题报告表单。' },
  fieldset: { summary: '把相关表单控件归在同一个问题或说明下。', whenToUse: '用于单选、复选或关联输入框等需要共享问题才能理解的控件。', howItWorks: '图例成为整个控件组的无障碍名称，也可以显示为页面级标题。' },
  'file-upload': { summary: '让用户选择并上传文件。', whenToUse: '仅在服务确实需要文档或图片时使用。上传前说明支持的格式与大小限制。', howItWorks: '保留原生文件输入框，并统一显示标签、提示和错误。' },
  'generic-footer': { summary: '在页面底部添加辅助链接和机构信息。', whenToUse: '适用于 GOV.UK 之外、不需要王室版权或 GOV.UK 许可文字的服务。', howItWorks: 'Footer 提供布局；请提供适合本机构的链接和文字。' },
  'generic-header': { summary: '为非 GOV.UK 服务提供简洁的品牌页眉。', whenToUse: '服务需要设计系统的交互规范，但不应呈现为 GOV.UK 时使用。', howItWorks: '提供服务名称和可选标志。组件不使用 GOV.UK 标志，也不包含服务导航。' },
  'inset-text': { summary: '将简短的补充信息与周围内容区分开。', whenToUse: '谨慎用于与附近内容相关、但并非主要信息的文字。', howItWorks: '粗左边框和间距带来强调效果，同时不暗示成功、警告或错误状态。' },
  'language-navigation': { summary: '让用户在服务提供的语言之间切换。', whenToUse: '同一服务流程提供两种或更多语言时使用。', howItWorks: '当前语言显示为带 aria-current 的文字，其他语言是可切换的链接；语言导航也有独立的无障碍标签。' },
  'notification-banner': { summary: '告知用户重要变化或操作成功。', whenToUse: '在主要内容顶部展示需要注意的信息。成功样式只用于操作完成之后。', howItWorks: '成功样式使用 alert 角色；普通通知使用带标签的区域，避免不必要的打断。' },
  pagination: { summary: '帮助用户浏览被分成多页的长列表。', whenToUse: '内容太长、无法在一页中展示时使用。每页容量应合理，翻页时保留筛选条件。', howItWorks: '编号分页使用 current 和 total；也可通过 previous 和 next 使用 GOV.UK 区块导航样式。' },
  panel: { summary: '在确认或流程中断页面突出重要信息。', whenToUse: '事务完成后使用确认样式；需要暂停流程并显示重要信息时使用中断样式。', howItWorks: '标题作为页面主标题。中断面板可加入操作，让用户继续或更改流程。' },
  'password-input': { summary: '让用户输入密码，并可选择显示已输入的内容。', whenToUse: '用于密码和类似的秘密信息。不要禁用粘贴或密码管理器。', howItWorks: '显示／隐藏按钮更新原生输入框类型，并传达按钮的按下状态。' },
  'phase-banner': { summary: '告诉用户服务处于新上线或持续改进阶段。', whenToUse: '服务测试期间使用 alpha 或 beta 横幅，并提供反馈入口。', howItWorks: '简短的状态标签后面跟随说明和反馈链接。' },
  radios: { summary: '让用户从列表中选择一个选项。', whenToUse: '用于少量互斥选项。空间允许时直接展示全部选项，不要藏在下拉框中。', howItWorks: '各选项共享 fieldset 图例，选择后可显示条件内容。' },
  'search-input': { summary: '让用户通过带有易识别图标的输入框搜索。', whenToUse: '用于搜索或筛选内容。为字段提供具体标签；结果建议和搜索逻辑由父组件处理。', howItWorks: '原生搜索框保留键盘和浏览器行为。图标只起装饰作用，可置于两侧、替换或隐藏。' },
  select: { summary: '让用户从紧凑的原生列表中选择一个选项。', whenToUse: '仅在用户熟悉可选项，或选项太多、不适合单选按钮时使用。', howItWorks: '原生 select 保留平台的键盘、触摸和辅助技术行为。' },
  'service-navigation': { summary: '在主标题下显示服务名称和导航链接。', whenToUse: '服务有明确的栏目或账户相关页面时使用。简短服务不需要额外导航。', howItWorks: '服务名称和当前导航项在带标签的导航区域中清楚区分。' },
  'skip-link': { summary: '让键盘用户跳过重复导航，直接进入主要内容。', whenToUse: '每个包含重复页眉或导航内容的页面都应将其作为第一个可聚焦元素。', howItWorks: '链接平时在视觉上隐藏，获得焦点时显示，并指向主要内容区域。' },
  'summary-list': { summary: '以键值行展示相关信息，并可附带操作。', whenToUse: '用于需要核对答案或记录详情的审阅、确认页面。', howItWorks: '每行都是语义化的描述列表条目；操作链接包含视觉隐藏的上下文。' },
  table: { summary: '按行列展示信息，便于直接比较。', whenToUse: '当网格更有助于理解各项数值的关系时使用。不要仅为页面排版使用表格。', howItWorks: '列定义把记录字段映射到语义化表头，还可格式化数字或指定行标题。' },
  tabs: { summary: '让用户在相关的内容区块之间切换。', whenToUse: '适用于少量并列区块，方便用户比较。不要用标签页表示顺序步骤。', howItWorks: '在平板及更宽屏幕上，选中的标签控制对应面板；窄屏上变成目录，并依次显示全部面板。' },
  tag: { summary: '用紧凑的标签显示事物的状态。', whenToUse: '用于帮助用户浏览列表或记录的状态。不要将标签当作按钮，也不要仅依赖颜色。', howItWorks: '简短文字和可选颜色传达状态，同时保持足够的对比度。' },
  'task-list': { summary: '显示用户需要完成的任务及各任务状态。', whenToUse: '用于允许用户分多次或不按固定顺序完成任务的较长服务。', howItWorks: '每个任务链接都与可见状态关联，也可以包含简短提示。' },
  'text-input': { summary: '让用户输入少量文字。', whenToUse: '用于姓名、参考编号或电子邮箱等信息。字段宽度应符合预期答案。', howItWorks: '标签、提示和错误的 ID 会通过 aria-describedby 自动关联，同时保留原生输入框属性。' },
  textarea: { summary: '让用户输入多行文字。', whenToUse: '答案可能有多个词或句子时使用。简短答案使用普通文本输入框。', howItWorks: '原生 textarea 保留调整大小和平台输入行为，并与其他字段共享标签、提示和错误处理。' },
  'warning-text': { summary: '警示用户某项操作或不操作可能带来的重要后果。', whenToUse: '用户必须了解严重后果时使用。措辞应直接，不要过度使用警告。', howItWorks: '图标、加粗文字和视觉隐藏的前缀共同传达重要性，不只依靠颜色。' },
}

const extraText: Record<string, DocTranslation> = {
  divider: { summary: '使用 GOV.UK 分隔线样式区分内容区块。', whenToUse: '当仅靠留白不足以区分内容区块时使用。不要在每个字段或段落之间都画线。', howItWorks: '渲染带有 GOV.UK 间距样式的语义化 hr。将 visible 设为 false 可只保留间距。' },
  modal: { summary: '用于在返回页面前完成简短决定或任务的聚焦对话框。', whenToUse: '用于简短确认或聚焦任务。较长的流程应放在普通页面。', howItWorks: '原生 dialog 进入顶层并将键盘焦点限制在其中。Escape、关闭按钮和可选的背景点击通过 onClose 请求关闭；关闭后焦点会回到打开对话框的元素。' },
  empty: { summary: '用于列表、表格或搜索结果为空时的清晰提示。', whenToUse: '视图无数据或筛选后没有结果时使用。适当说明原因或提供下一步操作。', howItWorks: '中性容器中显示可见标题、正文和操作；正文通过 children 传入，操作通过 actions 属性传入。插图只起装饰作用，可以替换。' },
  loading: { summary: '内容加载期间使用的旋转指示器和骨架屏。', whenToUse: '短暂等待使用旋转指示器；已知待加载内容的结构时使用骨架屏。', howItWorks: '两种样式都向辅助技术公开状态标签；用户要求减少动态效果时会停止动画。' },
  menu: { summary: '支持键盘导航的紧凑操作列表。', whenToUse: '用于一组简短的相关操作。主要页面导航应使用普通导航链接。', howItWorks: '方向键和 Home／End 可在可用操作间移动焦点。条目可使用 href 或 onClick；同时提供时，onClick 优先。' },
  dropdown: { summary: '点击按钮后展开紧凑的操作菜单。', whenToUse: '工具栏或记录行中有多个次要操作，需要共用一个入口时使用。', howItWorks: '触发按钮公开展开状态。菜单打开后焦点移至第一个操作；选中条目、按 Escape 或点击外部可关闭菜单。' },
  'fancy-table': { summary: '支持可选排序、筛选、行选择和客户端分页的数据表格。', whenToUse: '记录需要比较和直接操作时使用。简单的只读数据仍可使用标准 Table。', howItWorks: '列比较函数和筛选函数在本地处理数据；行选择可由外部控制，也可由组件管理。“全选”只作用于当前页。' },
  'fancy-tabs': { summary: '用更醒目的标签页在实时预览和 React 源码等视图之间切换。', whenToUse: '当界面需要比标准 Tabs 组件更显眼的标签页时使用。', howItWorks: '它与标准 Tabs 共享属性，并由 React 管理选中面板。方向键可在标签之间移动。' },
  form: { summary: '收集并校验相关答案，同时显示 GOV.UK 字段错误和错误摘要。', whenToUse: '页面包含多个需要在提交时一并校验的答案时使用。', howItWorks: 'Form.Item 将字段接入原生表单。提交时读取 FormData、校验规则、保留已输入答案、显示字段错误，并将焦点移至错误摘要。' },
  note: { summary: '突出简短的实现说明或其他补充信息。', whenToUse: '补充指导需要比普通正文更醒目，但并不表示警告或成功状态时使用。', howItWorks: '可选标题显示在内容上方。Note 接受普通 div 属性，页面可以用 className 调整局部间距。' },
  sidebar: { summary: '为相关页面或区块提供嵌套导航，并可选择展开和收起。', whenToUse: '用于一组相关文档页面。导航树较大时可启用折叠分组。', howItWorks: '链接默认渲染为锚点；分组可以包含多级子项。renderLink 可提供客户端路由链接，当前分支会高亮。' },
  'showcase-box': { summary: '用统一的标题、说明、实时示例和相关链接展示组件或设计模式。', whenToUse: '在设计系统总览或文档页面中，需要以一致容器展示多个组件时使用。', howItWorks: '标题层级可配置，页眉和页脚插槽可接收任意 React 内容，顶部强调条跟随当前品牌色 token。' },
  'tag-box': { summary: '用于版本号等简短元信息的中性描边标签。', whenToUse: '用于不表示状态的元信息。表示状态时请使用标准 Tag 组件。', howItWorks: '它渲染 span，接受标准 span 属性以及可选的 className。' },
  switch: { summary: '用于立即生效设置的二元开关。', whenToUse: '用于更改后立即生效的开关设置。选项需要随表单提交时，请使用复选框或单选按钮。', howItWorks: '开关是带 role switch 和 aria-checked 状态的按钮。字符串子元素会成为视觉隐藏的标签。轨道内默认显示 On/Off 文字，可通过 checkedChildren 和 unCheckedChildren 自定义。加载状态会在滑块中显示旋转指示器并阻止交互。' },
  tooltip: { summary: '在元素旁边显示用于解释的简短标签。', whenToUse: '用于对图标、按钮或状态文字做简短说明。不要隐藏用户完成任务必须阅读的信息，表单字段请使用可见的提示文字。', howItWorks: '唯一的子元素会被克隆并附加触发事件处理器。内容为纯文本或数字时，弹层打开期间触发器会获得 aria-describedby，弹层本身带 role tooltip。' },
  alert: { summary: '显示操作后的成功、信息、警告或错误消息。', whenToUse: '用于页面上某个操作的结果，例如保存完成或请求失败。表单校验错误请使用错误摘要组件。', howItWorks: '错误和警告使用 alert 角色以便立即播报；成功和信息使用 status 角色。正文通过 children 传入，description 提供次要文本。可选图标与类型对应；可关闭的警告会显示关闭按钮。' },
  steps: { summary: '向用户展示其在简短线性步骤序列中的位置。', whenToUse: '用于设置或提交流程等简短的线性步骤。较长或非线性的流程应拆分为多个页面。', howItWorks: '当前索引之前的步骤视为完成，之后的视为等待，除非条目显式指定状态。点击步骤会调用 onChange 并传入其索引；当前步骤带 aria-current。' },
  progress: { summary: '显示任务、上传或加载操作的进度。', whenToUse: '用于可测量的进度，例如文件上传或多步保存。等待时间未知百分比时使用 Loading 组件。', howItWorks: '进度条带 role progressbar，aria-valuenow 为截断到 0-100 的百分比。达到 100 及以上时自动使用成功样式。' },
  result: { summary: '展示页面级操作的结果，例如已提交的申请或失败的付款。', whenToUse: '表单提交、付款或异步操作得到明确结果后使用。文案保持简短，并提供最可能的下一步操作。', howItWorks: '每种状态渲染对应的图标和颜色，也可传入自定义图标。正文通过 children 传入；extra 区域放置主要和次要操作。错误和警告使用 alert 角色以便立即播报。' },
  avatar: { summary: '以图片、首字母或备用图标显示用户或实体。', whenToUse: '用于页眉、记录行或评论列表中标识个人或组织。对象不确定时优先使用首字母或文字而非图片。', howItWorks: '图片 src 优先，其次是首字母等文字内容，最后是通用人物图标。形状支持圆形或方形，尺寸支持命名档位或像素值。' },
  'code-box': { summary: '渲染带语法高亮的带边框代码块。', whenToUse: '在文档和工具页面中展示配置或用法片段。片段为静态内容时，可在构建期传入预高亮 HTML。', howItWorks: '未提供 highlightedHtml 时，组件懒加载 Shiki 在客户端高亮，期间先显示转义的纯文本。配色采用 GitHub Light 调色板，白底，契合 GOV.UK 页面风格。' },
  grid: { summary: '使用 Row 和 Col 按列排版页面内容，是 GOV.UK 网格的薄包装。', whenToUse: '需要使用 GOV.UK 熟悉的列宽和断点组织页面内容时使用。表单对齐由标准组件自行处理。', howItWorks: 'Row 渲染 govuk-grid-row 类，Col 渲染六种分数之一的 govuk-grid-column-<width> 类。设置 fromDesktop 使用 -from-desktop 变体，在桌面断点以下占满整行。两者都接受标准 div 属性和 className。' },
  card: { summary: '将相关内容收纳在带可选页眉、底部操作区和悬停高亮的容器中。', whenToUse: '用于在页面上归组相关的信息、摘要或操作。展示事务完成的确认结果时使用 Panel 组件。', howItWorks: 'title 和 extra 渲染在页眉行中，children 渲染在正文中，actions 渲染在上边框分隔的页脚中。设置 hoverable 可在悬停时用品牌色高亮边框。classNames 和 styles 可分别指定 root、header、title、extra、body 和 actions 各部分。' },
  calendar: { summary: '从月视图中选择某一天，支持键盘导航和最小／最大日期限制。', whenToUse: '用于用户必须从有限日期集合中选择一天的场景，例如预约时段。用户已经知道日期时，DateInput 组件通常更快。', howItWorks: '选中的日期和可见月份均可受控或由组件内部管理，并提供上一月／下一月按钮和可选的 Today 按钮。方向键按天或周移动，Home／End 跳到周末，PageUp／PageDown 按月移动，按住 Shift 则按年移动。min 和 max 会禁用范围外的日期；dateCellRender 可在日期单元格角落添加标记；locale 控制星期和月份名称。' },
  transfer: { summary: '在源列表和目标列表之间移动条目，支持复选框和可选搜索。', whenToUse: '用于从较大集合中选取子集的场景，例如分配权限或选择表格列。单个选择请使用复选框或下拉框。', howItWorks: '条目按 targetKeys 拆分到两个面板中，勾选的条目通过 Add 和 Remove 按钮移动。禁用的条目无法勾选或移动。showSearch 通过 filterOption 筛选两个列表，默认对标签做不区分大小写的匹配。targetKeys 和 selectedKeys 支持受控用法。暂不支持单向（oneWay）模式。' },
  slider: { summary: '从轨道上选择单个值或 [下限, 上限] 区间，支持刻度标记和数值气泡。', whenToUse: '用于精确数字不重要的粗略调节，例如音量或大致预算。GOV.UK 建议滑块只用于粗略值；用户需要输入精确值时，请改用 Text input 或 Select 组件。', howItWorks: '轨道内包含一个或两个原生 range 输入框。数值和区间均可受控或由组件内部管理；区间模式下两个手柄不会互相越过。marks 在轨道下方渲染带可选标签的刻度，tooltip 控制数值气泡在悬停、始终或从不显示。方向键按 step 步进移动，屏幕阅读器会播报每个手柄，区间模式下会带 minimum／maximum 标签。' },
  timepicker: { summary: '以 24 小时制 HH:mm 格式输入或选择一天中的时间，提供可选的时、分两列面板。', whenToUse: '用于近期或常用时间的场景，此时直接输入 HH:mm 或从短面板中选择比三个独立下拉框更快，例如预约开始时间。用户需要输入易记或大致的时间，或需要 12 小时制 AM/PM 格式时，采用 GOV.UK 的做法，用标准 Select 组件分别提供小时和分钟下拉框可能更容易说明；完全不需要面板时，单独使用 Text input 即可。', howItWorks: '输入框接受宽松的 H:mm 文本，非受控时会被规范化为 HH:mm。聚焦输入框或点击时钟按钮会打开 24 小时制列表框，包含时、分两列，并按 hourStep 和 minuteStep 精简选项，打开时会自动滚动定位到当前选中的时间；ArrowUp／ArrowDown 在选项间移动焦点，Escape 关闭面板并将焦点还给输入框，选择某一项后提交该值。label、hint 和 error 通过 aria-describedby 关联，status 会额外添加一条被描述的行。' },
}

export function localizedComponent(component: ComponentDoc, locale: Locale): ComponentDoc {
  return locale === 'zh' ? { ...component, ...componentText[component.slug] } : component
}

export function localizedExtraComponent(component: ExtraComponentDoc, locale: Locale): ExtraComponentDoc {
  return locale === 'zh' ? { ...component, ...extraText[component.slug] } : component
}
