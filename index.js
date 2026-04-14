const { createApp, ref, computed, reactive, onMounted } = Vue;

const i18nDict = {
    zh: { 
        nav_articles: "科普文章", nav_about: "关于我们", nav_help: "帮助中心", selected_color: "当前颜色", hue: "色相", alpha: "透明度", linear_color: "Linear Color (Gamma 2.2)", rgb: "RGB", hex: "HEX", hsl: "HSL", hsv: "HSV", color_history: "记录", clear_history: "清空", lang_label: "语言", 
        sec_about_title: "开发初衷与工具简介", sec_about_desc: "作为虚幻引擎开发者，我们经常需要将 UI 设计师提供的 sRGB 或 HEX 颜色准确地还原到引擎内部的线性颜色空间 (Linear Color Space)。手动计算 Gamma 2.2 曲线不仅繁琐而且容易出错。我们开发了这款高精度的 UE5 颜色转换器，旨在无缝转换 Linear Color、sRGB、HEX、HSL 和 HSV。无论你是编写 C++ UI 模块、调整 UMG 控件，还是制作材质，都能在此瞬间获取引擎就绪的 FLinearColor 数值。", 
        sec_guide_title: "使用指南", sec_guide_desc: "工具的使用非常直观：你可以直接将网页颜色代码粘贴到 HEX 输入框中，或者使用可视化的拾色器寻找理想的色调。所有相关颜色模型的数据将实时同步更新。点击“Linear Color”标题旁的复制图标，即可一键复制 Unreal Engine 所需的精确浮点数参数。你还可以根据团队的代码规范，自由切换 HEX 的格式（大/小写、是否带 # 号）。", 
        sec_theory_title: "技术原理：sRGB 与线性颜色的区别", sec_theory_desc: "为什么 Unreal Engine 强制使用 Linear Color？现代游戏引擎依赖基于物理的渲染 (PBR)，这要求所有光照 and 颜色计算必须在线性空间中进行，以保证物理上的准确性。然而，显示器为了契合人眼的视觉感知，默认使用 sRGB 曲线（约等于 Gamma 2.2）显示颜色。如果直接将 sRGB 值输入材质而不进行转换，游戏内的颜色会显得发灰或失真。本工具为你自动执行了严谨的逆向 Gamma 矫正数学计算。", 
        sec_faq_title: "常见问题解答", sec_faq_q1: "问：为什么转换后的颜色在 UE5 编辑器里看起来还是有偏差？", sec_faq_a1: "答：请确保 UE5 中的纹理或材质节点设置正确。如果你在 UMG 中设置 UI 颜色，纹理的 sRGB 勾选状态会影响最终显示。本工具提供的是数学上绝对准确的线性转换值。", 
        sec_faq_q2: "问：我的颜色数据会被上传到服务器吗？", sec_faq_a2: "答：绝对不会。所有的颜色计算都在你的浏览器本地通过 JavaScript 瞬间完成。底部的颜色历史记录也是保存在你浏览器的本地缓存（LocalStorage）中，仅供你个人方便使用。", 
        privacy_policy: "隐私政策",
        ad_tag: "作者推荐", ad_title: "Versatile Color Picker", ad_desc: "专为虚幻引擎设计的高性能拾色器。支持多种颜色空间实时转换，完美解决 UMG 与材质间的色差问题，大幅提升 UI 开发效率。", ad_price: "售价: $9.99", ad_btn: "前往 Fab 购买"
    },
    'zh-HK': { 
        nav_articles: "科普文章", nav_about: "關於我們", nav_help: "幫助中心", selected_color: "目前顏色", hue: "色相", alpha: "透明度", linear_color: "Linear Color (Gamma 2.2)", rgb: "RGB", hex: "HEX", hsl: "HSL", hsv: "HSV", color_history: "歷史記錄", clear_history: "清除", lang_label: "語言", 
        sec_about_title: "開發初衷與工具簡介", sec_about_desc: "作為虛幻引擎 (Unreal Engine) 開發者，我們經常需要將 UI 設計師提供的 sRGB 或 HEX 顏色準確地還原到引擎內部的線性顏色空間 (Linear Color Space)。手動計算 Gamma 2.2 曲線不僅繁瑣而且容易出錯。我們開發了這款高精度的 UE5 顏色轉換器，旨在無縫轉換 Linear Color、sRGB、HEX、HSL 和 HSV。無論你是編寫 C++ UI 模塊、調整 UMG 控件，還是製作材質，都能在此瞬間獲取引擎就緒的 FLinearColor 數值。", 
        sec_guide_title: "使用指南", sec_guide_desc: "工具的使用非常直觀：你可以直接將網頁顏色代碼貼上到 HEX 輸入框中，或者使用視覺化的拾色器尋找理想的色調。所有相關顏色模型的數據將即時同步更新。點擊「Linear Color」標題旁的複製圖示，即可一鍵複製 Unreal Engine 所需的精確浮點數參數。你還可以根據團隊的代碼規範，自由切換 HEX 的格式（大/小寫、是否帶 # 號）。", 
        sec_theory_title: "技術原理：sRGB 與線性顏色的區別", sec_theory_desc: "為什麼 Unreal Engine 強制使用 Linear Color？現代遊戲引擎依賴基於物理的渲染 (PBR)，這要求所有光照和顏色計算必須在線性空間中進行，以保證物理上的準確性。然而，顯示器為了契合人眼的視覺感知，默認使用 sRGB 曲線（約等於 Gamma 2.2）顯示顏色。如果直接將 sRGB 值輸入材質而不進行轉換，遊戲內的顏色會顯得發灰或失真。本工具為你自動執行了嚴謹的逆向 Gamma 矯正常式。", 
        sec_faq_title: "常見問題解答", sec_faq_q1: "問：為什麼轉換後的顏色在 UE5 編輯器裡看起來還是有偏差？", sec_faq_a1: "答：請確保 UE5 中的紋理或材質節點設定正確。如果你在 UMG 中設定 UI 顏色，紋理的 sRGB 勾選狀態會影響最終顯示。本工具提供的是數學上絕對準確的線性轉換值。", 
        sec_faq_q2: "問：我的顏色數據會被上傳到伺服器嗎？", sec_faq_a2: "答：絕對不會。所有的顏色計算都在你的瀏覽器本地透過 JavaScript 瞬間完成。底部的顏色歷史記錄也是保存在你瀏覽器的本地緩存（LocalStorage）中，僅供你個人方便使用。", 
        privacy_policy: "私隱政策",
        ad_tag: "作者推薦", ad_title: "Versatile Color Picker", ad_desc: "專為虛幻引擎設計的高性能拾色器。支持多種顏色空間實時轉換，完美解決 UMG 與材質間的色差問題，大幅提升 UI 開發效率。", ad_price: "售價: $9.99", ad_btn: "前往 Fab 購買"
    },
    'zh-TW': { 
        nav_articles: "科普文章", nav_about: "關於我們", nav_help: "幫助中心", selected_color: "目前顏色", hue: "色相", alpha: "透明度", linear_color: "Linear Color (Gamma 2.2)", rgb: "RGB", hex: "HEX", hsl: "HSL", hsv: "HSV", color_history: "歷史紀錄", clear_history: "清除", lang_label: "語言", 
        sec_about_title: "開發初衷與工具簡介", sec_about_desc: "作為虛幻引擎 (Unreal Engine) 開發者，我們經常需要將 UI 設計師提供的 sRGB 或 HEX 顏色準確地還原到引擎內部的線性顏色空間 (Linear Color Space)。手動計算 Gamma 2.2 曲線不僅繁瑣而且容易出錯。我們開發了這款高精度的 UE5 顏色轉換器，旨在無縫轉換 Linear Color、sRGB、HEX、HSL 和 HSV。無論你是編寫 C++ UI 模塊、調整 UMG 控制項，還是製作材質，都能在此瞬間獲取引擎就緒的 FLinearColor 數值。", 
        sec_guide_title: "使用指南", sec_guide_desc: "工具的使用非常直觀：你可以直接將網頁顏色代碼貼上到 HEX 輸入框中，或者使用視覺化的拾色器尋找理想的色調。所有相關顏色模型的數據將即時同步更新。點擊「Linear Color」標題旁的複製圖示，即可一鍵複製 Unreal Engine 所需的精確浮點數參數。你還可以根據團隊的程式碼規範，自由切換 HEX 的格式（大/小寫、是否帶 # 號）。", 
        sec_theory_title: "技術原理：sRGB 與線性顏色的區別", sec_theory_desc: "為什麼 Unreal Engine 強制使用 Linear Color？現代遊戲引擎依賴基於物理的渲染 (PBR)，這要求所有光照和顏色計算必須在線性空間中進行，以保證物理上的準確性。然而，顯示器為了契合人眼的視覺感知，預設使用 sRGB 曲線（約等於 Gamma 2.2）顯示顏色。如果直接將 sRGB 值輸入材質而不進行轉換，遊戲內的顏色會顯得發灰或失真。本工具為你自動執行了嚴謹的逆向 Gamma 校正數學計算。", 
        sec_faq_title: "常見問題解答", sec_faq_q1: "問：為什麼轉換後的顏色在 UE5 編輯器裡看起來還是有偏差？", sec_faq_a1: "答：請確保 UE5 中的紋理或材質節點設定正確。如果你在 UMG 中設定 UI 顏色，紋理的 sRGB 勾選狀態會影響最終顯示。本工具提供的是數學上絕對準確的線性轉換值。", 
        sec_faq_q2: "問：我的顏色數據會被上傳到伺服器嗎？", sec_faq_a2: "答：絕對不會。所有的顏色計算都在你的瀏覽器本地透過 JavaScript 瞬間完成。底部的顏色歷史紀錄也是保存在你瀏覽器的本地快取（LocalStorage）中，僅供你個人方便使用。", 
        privacy_policy: "隱私權政策",
        ad_tag: "作者推薦", ad_title: "Versatile Color Picker", ad_desc: "專為虛幻引擎設計的高性能拾色器。支持多種顏色空間實時轉換，完美解決 UMG 與材質間的色差問題，大幅提升 UI 開發效率。", ad_price: "售價: $9.99", ad_btn: "前往 Fab 購買"
    },
    en: { 
        nav_articles: "Articles", nav_about: "About Us", nav_help: "Help Center", selected_color: "Selected", hue: "Hue", alpha: "Alpha", linear_color: "Linear Color (Gamma 2.2)", rgb: "RGB", hex: "HEX", hsl: "HSL", hsv: "HSV", color_history: "History", clear_history: "Clear", lang_label: "Language", 
        sec_about_title: "About This Tool (Development Intent)", sec_about_desc: "As Unreal Engine developers, we constantly face the challenge of matching UI design colors (which are in sRGB or HEX) to the Engine's internal Linear Color space. Manually calculating the Gamma 2.2 curve is tedious and prone to error. We built this high-precision UE5 Color Converter to seamlessly translate between Linear Color, sRGB, HEX, HSL, and HSV. Whether you are coding C++ UI modules, adjusting UMG widgets, or creating Materials, this tool provides instant, engine-ready FLinearColor values.", 
        sec_guide_title: "User Guide", sec_guide_desc: "Using the converter is intuitive: simply paste your web color code into the HEX box, or use the visual color picker to find the perfect shade. All other color models will update instantly. Click the copy icon next to the 'Linear Color (Gamma 2.2)' header to copy the exact values needed for Unreal Engine's parameter inputs. You can also toggle HEX formatting preferences (uppercase/lowercase, hash inclusion) to match your team's coding standards.", 
        sec_theory_title: "The Principle: sRGB vs Linear Color", sec_theory_desc: "Why does Unreal Engine use Linear Color? Modern game engines rely on Physically Based Rendering (PBR), which requires light calculations to be done in a linear space to remain physically accurate. However, computer monitors display colors using an sRGB curve (approximately Gamma 2.2) to match human eye perception. If you directly input standard sRGB values into a material without converting them, the colors will appear washed out or incorrect in the game. This tool automatically applies the correct mathematical inverse gamma correction for you.", 
        sec_faq_title: "Frequently Asked Questions", sec_faq_q1: "Q: Why do my colors still look different in the UE5 editor?", sec_faq_a1: "A: Ensure that the texture or material setting in UE5 is expecting Linear Color. If you are setting UI colors in UMG, checking 'sRGB' on the texture or unchecking it can alter the result. Our tool provides the mathematically pure linear conversion.", 
        sec_faq_q2: "Q: Are my colors saved to a server?", sec_faq_a2: "A: No. All conversions happen entirely in your browser using local JavaScript. Your color history is saved in your browser's Local Storage for your convenience only.", 
        privacy_policy: "Privacy Policy",
        ad_tag: "Author's Choice", ad_title: "Versatile Color Picker", ad_desc: "A high-performance color picker designed for Unreal Engine. Real-time conversion across color spaces, fixing UMG color shifts instantly.", ad_price: "Price: $9.99", ad_btn: "Get it on Fab"
    },
    ja: { 
        nav_articles: "記事", nav_about: "概要", nav_help: "ヘルプセンター", selected_color: "選択中の色", hue: "色相", alpha: "透明度", linear_color: "リニアカラー (Gamma 2.2)", rgb: "RGB", hex: "HEX", hsl: "HSL", hsv: "HSV", color_history: "履歴", clear_history: "クリア", lang_label: "言語", 
        sec_about_title: "開発の意図とツールの概要", sec_about_desc: "Unreal Engineの開発者として、UIデザインの色（sRGBやHEX）をエンジン内部のリニアカラー空間に正確に変換することは常に課題です。Gamma 2.2カーブを手動で計算するのは面倒でエラーが発生しやすくなります。この高精度なUE5カラーコンバーターは、Linear Color、sRGB、HEX、HSL、HSVをシームレスに変換するために開発されました。C++のUIモジュールを作成する場合でも、UMGウィジェットを調整する場合でも、マテリアルを作成する場合でも、エンジンですぐに使えるFLinearColor値を瞬時に取得できます。", 
        sec_guide_title: "使い方ガイド", sec_guide_desc: "使い方は非常に直感的です。ウェブのカラーコードをHEXボックスに貼り付けるか、カラーピッカーで理想の色を選択するだけです。他のすべてのカラーモデルは瞬時に更新されます。「Linear Color」の横にあるコピーアイコンをクリックすると、Unreal Engineのパラメータ入力に必要な正確な値がコピーされます。また、チームのコーディング規約に合わせて、HEXのフォーマット（大文字/小文字、ハッシュタグの有無）を切り替えることもできます。", 
        sec_theory_title: "原理：sRGBとリニアカラーの違い", sec_theory_desc: "なぜUnreal Engineはリニアカラーを使用するのでしょうか？現代のゲームエンジンは物理ベースレンダリング（PBR）に依存しており、物理的な正確さを保つために光の計算はリニア空間で行う必要があります。しかし、モニターは人間の目の知覚に合わせてsRGBカーブ（約Gamma 2.2）を使用して色を表示します。変換せずに標準のsRGB値をそのままマテリアルに入力すると、ゲーム内での色がくすんだり不正確になります。このツールは、厳密な逆ガンマ補正の計算を自動的に行います。", 
        sec_faq_title: "よくある質問 (FAQ)", sec_faq_q1: "Q: UE5エディターで色がまだ違って見えるのはなぜですか？", sec_faq_a1: "A: UE5のテクスチャやマテリアルの設定がリニアカラーを想定しているか確認してください。UMGでUIカラーを設定する場合、テクスチャの「sRGB」のチェックを外すか入れるかで結果が変わります。このツールは数学的に純粋なリニア変換を提供します。", 
        sec_faq_q2: "Q: 色のデータはサーバーに保存されますか？", sec_faq_a2: "A: いいえ。すべての変換はローカルのJavaScriptを使用してブラウザ内で完全に処理されます。カラー履歴は、利便性のためにブラウザのローカルストレージにのみ保存されます。", 
        privacy_policy: "プライバシーポリシー",
        ad_tag: "おすすめ", ad_title: "Versatile Color Picker", ad_desc: "Unreal Engine専用の高性能カラーピッカー。カラースペースのリアルタイム変換をサポートし、UI開発効率を大幅に向上させます。", ad_price: "価格: $9.99", ad_btn: "Fabで購入"
    },
    ko: { 
        nav_articles: "관련 기사", nav_about: "소개", nav_help: "도움말 센터", selected_color: "선택된 색상", hue: "색조", alpha: "알파(투명도)", linear_color: "선형 색상 (Gamma 2.2)", rgb: "RGB", hex: "HEX", hsl: "HSL", hsv: "HSV", color_history: "기록", clear_history: "지우기", lang_label: "언어", 
        sec_about_title: "도구 소개 및 개발 의도", sec_about_desc: "언리얼 엔진 개발자로서 우리는 UI 디자인 색상(sRGB 또는 HEX)을 엔진 내부의 선형 색상 공간(Linear Color Space)으로 정확히 일치시켜야 하는 문제에 자주 직면합니다. Gamma 2.2 곡선을 수동으로 계산하는 것은 번거롭고 오류가 발생하기 쉽습니다. 우리는 Linear Color, sRGB, HEX, HSL 및 HSV 간의 원활한 변환을 위해 이 고정밀 UE5 색상 변환기를 개발했습니다. C++ UI 모듈을 코딩하든, UMG 위젯을 조정하든, 머티리얼을 제작하든 이 도구를 사용하면 엔진에서 바로 사용할 수 있는 FLinearColor 값을 즉시 얻을 수 있습니다.", 
        sec_guide_title: "사용 가이드", sec_guide_desc: "도구 사용법은 매우 직관적입니다. 웹 색상 코드를 HEX 입력란에 붙여넣거나 시각적 색상 선택기를 사용하여 완벽한 색조를 찾으세요. 다른 모든 색상 모델의 데이터가 실시간으로 동기화되어 업데이트됩니다. 'Linear Color' 제목 옆의 복사 아이콘을 클릭하여 언리얼 엔진의 매개변수 입력에 필요한 정확한 값을 복사할 수 있습니다. 또한 팀의 코드 규칙에 맞게 HEX 형식(대/소문자, # 포함 여부)을 자유롭게 전환할 수 있습니다.", 
        sec_theory_title: "원리: sRGB와 선형 색상의 차이", sec_theory_desc: "왜 언리얼 엔진은 선형 색상을 사용할까요? 현대의 게임 엔진은 물리 기반 렌더링(PBR)에 의존하며, 물리적 정확성을 유지하려면 모든 조명 및 색상 계산이 선형 공간에서 수행되어야 합니다. 그러나 모니터는 인간의 시각적 인지에 맞추기 위해 기본적으로 sRGB 곡선(약 Gamma 2.2)을 사용하여 색상을 표시합니다. sRGB 값을 변환하지 않고 머티리얼에 직접 입력하면 게임 내 색상이 흐릿하거나 왜곡되어 나타납니다. 이 도구는 수학적으로 엄격한 역감마 보정을 자동으로 수행합니다.", 
        sec_faq_title: "자주 묻는 질문", sec_faq_q1: "Q: 변환된 색상이 UE5 에디터에서 여전히 다르게 보이는 이유는 무엇입니까?", sec_faq_a1: "A: UE5의 텍스처나 머티리얼 노드 설정이 올바른지 확인하세요. UMG에서 UI 색상을 설정하는 경우 텍스처의 'sRGB' 체크 여부가 최종 표시에 영향을 줍니다. 이 도구는 수학적으로 완벽하게 정확한 선형 변환 값을 제공합니다.", 
        sec_faq_q2: "Q: 내 색상 데이터가 서버에 업로드됩니까?", sec_faq_a2: "A: 절대 아닙니다. 모든 색상 계산은 브라우저 내에서 JavaScript를 통해 즉각적이고 로컬로 처리됩니다. 하단의 색상 기록 역시 사용자의 편의를 위해 브라우저의 로컬 캐시(LocalStorage)에만 저장됩니다.", 
        privacy_policy: "개인정보처리방침",
        ad_tag: "저자 추천", ad_title: "Versatile Color Picker", ad_desc: "언리얼 엔진용 고성능 컬러 피커. 색 공간 실시간 변환을 지원하여 UI 개발 효율을 극대화합니다.", ad_price: "가격: $9.99", ad_btn: "Fab에서 구매"
    },
    ru: { 
        nav_articles: "Статьи", nav_about: "О нас", nav_help: "Помощь", selected_color: "Текущий цвет", hue: "Оттенок", alpha: "Альфа", linear_color: "Linear Color (Gamma 2.2)", rgb: "RGB", hex: "HEX", hsl: "HSL", hsv: "HSV", color_history: "История", clear_history: "Очистить", lang_label: "Язык", 
        sec_about_title: "О программе", sec_about_desc: "Как разработчики Unreal Engine, мы постоянно сталкиваемся с необходимостью точного преобразования цветов UI-дизайна (в формате sRGB или HEX) во внутреннее линейное цветовое пространство движка (Linear Color Space). Вычисление кривой Gamma 2.2 вручную утомительно и чревато ошибками. Мы создали этот высокоточный конвертер цветов UE5 для плавного перевода между Linear Color, sRGB, HEX, HSL и HSV.", 
        sec_guide_title: "Руководство", sec_guide_desc: "Вставьте HEX или выберите цвет. Значения синхронизируются.", 
        sec_theory_title: "Принцип", sec_theory_desc: "Преобразует стандартную кривую Gamma 2.2 в линейное пространство.", 
        sec_faq_title: "FAQ", sec_faq_q1: "В: Цвета выглядят иначе?", sec_faq_a1: "О: Проверьте настройки sRGB в UE5.", 
        sec_faq_q2: "В: Данные сохраняются?", sec_faq_a2: "О: Все работает локально.", 
        privacy_policy: "Политика конфиденциальности",
        ad_tag: "Выбор автора", ad_title: "Versatile Color Picker", ad_desc: "Высокопроизводительный выбор цвета для Unreal Engine. Поддержка конвертации в реальном времени.", ad_price: "Цена: $9.99", ad_btn: "Купить на Fab"
    },
    es: { 
        nav_articles: "Artículos", nav_about: "Sobre nosotros", nav_help: "Ayuda", selected_color: "Color actual", hue: "Matiz", alpha: "Alfa", linear_color: "Linear Color (Gamma 2.2)", rgb: "RGB", hex: "HEX", hsl: "HSL", hsv: "HSV", color_history: "Historial", clear_history: "Limpiar", lang_label: "Idioma", 
        sec_about_title: "Sobre la Herramienta", sec_about_desc: "Herramienta para convertir sRGB a Linear Color en UE5.", 
        sec_guide_title: "Guía", sec_guide_desc: "Pega el HEX o elige un color. Sincronización instantánea.", 
        sec_theory_title: "Teoría", sec_theory_desc: "Convierte la curva Gamma 2.2 a espacio lineal para PBR.", 
        sec_faq_title: "Preguntas Frecuentes", sec_faq_q1: "¿Colores incorrectos?", sec_faq_a1: "Revisa los ajustes de sRGB en UE5.", 
        sec_faq_q2: "¿Se guardan mis datos?", sec_faq_a2: "No, todo es local.", 
        privacy_policy: "Política de Privacidad",
        ad_tag: "Recomendado", ad_title: "Versatile Color Picker", ad_desc: "Selector de color de alto rendimiento para Unreal Engine. Conversión en tiempo real.", ad_price: "Precio: $9.99", ad_btn: "Comprar en Fab"
    },
    fr: { 
        nav_articles: "Articles", nav_about: "À propos", nav_help: "Aide", selected_color: "Couleur actuelle", hue: "Teinte", alpha: "Alpha", linear_color: "Couleur Linéaire", rgb: "RGB", hex: "HEX", hsl: "HSL", hsv: "HSV", color_history: "Historique", clear_history: "Effacer", lang_label: "Langue", 
        sec_about_title: "À propos", sec_about_desc: "Convertisseur sRGB vers Couleur Linéaire UE5.", 
        sec_guide_title: "Guide", sec_guide_desc: "Collez l'HEX ou choisissez une couleur.", 
        sec_theory_title: "Théorie", sec_theory_desc: "Conversion de Gamma 2.2 vers l'espace linéaire PBR.", 
        sec_faq_title: "FAQ", sec_faq_q1: "Q: Couleurs différentes?", sec_faq_a1: "R: Vérifiez les paramètres sRGB d'UE5.", 
        sec_faq_q2: "Q: Données?", sec_faq_a2: "R: Tout est local.", 
        privacy_policy: "Politique de confidentialité",
        ad_tag: "Choix de l'auteur", ad_title: "Versatile Color Picker", ad_desc: "Sélecteur de couleur haute performance pour Unreal Engine. Conversion en temps réel.", ad_price: "Prix: $9.99", ad_btn: "Acheter sur Fab"
    },
    de: { 
        nav_articles: "Artikel", nav_about: "Über uns", nav_help: "Hilfe", selected_color: "Aktuelle Farbe", hue: "Farbton", alpha: "Alpha", linear_color: "Lineare Farbe", rgb: "RGB", hex: "HEX", hsl: "HSL", hsv: "HSV", color_history: "Verlauf", clear_history: "Leeren", lang_label: "Sprache", 
        sec_about_title: "Über das Tool", sec_about_desc: "sRGB zu UE5 Linear Color Konverter.", 
        sec_guide_title: "Anleitung", sec_guide_desc: "HEX einfügen oder Farbe wählen.", 
        sec_theory_title: "Theorie", sec_theory_desc: "Wandelt Gamma 2.2 in linearen PBR-Raum um.", 
        sec_faq_title: "FAQ", sec_faq_q1: "F: Falsche Farben?", sec_faq_a1: "A: sRGB in UE5 prüfen.", 
        sec_faq_q2: "F: Datenschutz?", sec_faq_a2: "A: Alles läuft lokal.", 
        privacy_policy: "Datenschutzrichtlinie",
        ad_tag: "Empfohlen", ad_title: "Versatile Color Picker", ad_desc: "Hochleistungs-Farbwähler für Unreal Engine. Echtzeit-Konvertierung.", ad_price: "Preis: $9.99", ad_btn: "Bei Fab kaufen"
    },
    ar: { 
        nav_articles: "مقالات", nav_about: "معلومات عنا", nav_help: "مركز المساعدة", selected_color: "اللون الحالي", hue: "درجة اللون", alpha: "الشفافية", linear_color: "اللون الخطي", rgb: "RGB", hex: "HEX", hsl: "HSL", hsv: "HSV", color_history: "السجل", clear_history: "مسح", lang_label: "اللغة", 
        sec_about_title: "عن هذه الأداة", sec_about_desc: "محول ألوان UE5.", 
        sec_guide_title: "دليل", sec_guide_desc: "الصق HEX أو اختر لونًا.", 
        sec_theory_title: "المبدأ", sec_theory_desc: "يحول sRGB إلى مساحة خطية.", 
        sec_faq_title: "الأسئلة الشائعة", sec_faq_q1: "الألوان تبدو خاطئة؟", sec_faq_a1: "تحقق من إعدادات sRGB.", 
        sec_faq_q2: "البيانات؟", sec_faq_a2: "كل شيء محلي.", 
        privacy_policy: "سياسة الخصوصية",
        ad_tag: "توصية المؤلف", ad_title: "Versatile Color Picker", ad_desc: "ملتقط ألوان عالي الأداء لـ Unreal Engine.", ad_price: "السعر: $9.99", ad_btn: "احصل عليه من Fab"
    }
};

const supportedLangs = [
    { code: 'en', name: 'English', flag: 'fi-us' },
    { code: 'zh', name: '简体中文', flag: 'fi-cn' },
    { code: 'zh-HK', name: '繁體中文 (中国香港)', flag: 'fi-hk' },
    { code: 'zh-TW', name: '繁體中文 (中国台灣)', flag: 'fi-cn' },
    { code: 'ar', name: 'العربية', flag: 'fi-sa' },
    { code: 'ru', name: 'Русский', flag: 'fi-ru' },
    { code: 'es', name: 'Español', flag: 'fi-es' },
    { code: 'fr', name: 'Français', flag: 'fi-fr' },
    { code: 'de', name: 'Deutsch', flag: 'fi-de' },
    { code: 'ja', name: '日本語', flag: 'fi-jp' },
    { code: 'ko', name: '한국어', flag: 'fi-kr' }
];

// Math Core
const s2l = (s) => s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
const l2s = (l) => l <= 0.0031308 ? l * 12.92 : 1.055 * Math.pow(l, 1 / 2.4) - 0.055;
const hsv2rgb = (h, s, v) => {
    s /= 100; v /= 100;
    const f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
    return [Math.round(f(5) * 255), Math.round(f(3) * 255), Math.round(f(1) * 255)];
};
const rgb2hsv = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    let h, s = max === 0 ? 0 : d / max, v = max;
    if (d === 0) h = 0; else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h * 360, s * 100, v * 100];
};
const rgb2hsl = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) h = s = 0; else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h * 360, s * 100, l * 100];
};
const hsl2rgb = (h, s, l) => {
    h /= 360; s /= 100; l /= 100;
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    const f = (t) => {
        if (t < 0) t += 1; if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    };
    return [Math.round(f(h+1/3)*255), Math.round(f(h)*255), Math.round(f(h-1/3)*255)];
};

createApp({
    setup() {
        // Initial State
        const currH = ref(147);
        const currS = ref(72);
        const currV = ref(83);
        const currA = ref(1.0);
        
        const hexPrefs = reactive({ hash: true, upper: true });
        const hexInvalid = ref(false);
        const copyStatus = ref(null);

        // Alpha Switch States
        const enableAlpha = reactive({ linear: true, rgb: true, hex: true, hsl: true, hsv: true });
        
        // History
        const colorHistory = ref(JSON.parse(localStorage.getItem('ue5_color_history_v61')) || []);
        let historyTimer = null;

        // Lang Config
        const isLangDropdownOpen = ref(false);
        const currentLang = ref('en');
        
        const initLang = () => {
            const b = navigator.language.toLowerCase();
            if(b.includes('hk')) currentLang.value = 'zh-HK'; 
            else if(b.includes('tw')) currentLang.value = 'zh-TW';
            else {
                const s = b.split('-')[0]; 
                currentLang.value = i18nDict[s] ? s : 'en';
            }
            document.documentElement.dir = (currentLang.value === 'ar' ? 'rtl' : 'ltr');
            document.documentElement.lang = currentLang.value;
        };

        const setLanguage = (code) => {
            currentLang.value = code;
            document.documentElement.dir = (code === 'ar' ? 'rtl' : 'ltr');
            document.documentElement.lang = code;
            isLangDropdownOpen.value = false;
        };

        const t = computed(() => i18nDict[currentLang.value] || i18nDict['en']);
        const currentLangObj = computed(() => supportedLangs.find(l => l.code === currentLang.value) || supportedLangs[0]);

        // Computed Colors
        const rgb = computed(() => {
            const [r, g, b] = hsv2rgb(currH.value, currS.value, currV.value);
            return { r, g, b };
        });

        const hsl = computed(() => {
            const [h, s, l] = rgb2hsl(rgb.value.r, rgb.value.g, rgb.value.b);
            return { h: Math.round(h), s: Math.round(s), l: Math.round(l) };
        });

        const linear = computed(() => {
            return {
                r: s2l(rgb.value.r / 255).toFixed(6),
                g: s2l(rgb.value.g / 255).toFixed(6),
                b: s2l(rgb.value.b / 255).toFixed(6),
                a: currA.value.toFixed(6)
            };
        });

        const hexStr = computed(() => {
            let hex = [rgb.value.r, rgb.value.g, rgb.value.b]
                .map(x => x.toString(16).padStart(2, '0')).join('');
            hex = hexPrefs.upper ? hex.toUpperCase() : hex.toLowerCase();
            return (hexPrefs.hash ? '#' : '') + hex;
        });

        const hexAlphaStr = computed(() => {
            let alpha = Math.round(currA.value * 255).toString(16).padStart(2, '0');
            alpha = hexPrefs.upper ? alpha.toUpperCase() : alpha.toLowerCase();
            return hexStr.value + alpha;
        });

        const cssRgba = computed(() => `rgba(${rgb.value.r},${rgb.value.g},${rgb.value.b},${currA.value})`);
        const alphaGradient = computed(() => `linear-gradient(to right, rgba(${rgb.value.r},${rgb.value.g},${rgb.value.b},0), rgba(${rgb.value.r},${rgb.value.g},${rgb.value.b},1))`);
        const alphaPercent = computed({
            get: () => Math.round(currA.value * 100),
            set: (val) => { currA.value = Math.max(0, Math.min(100, val)) / 100; }
        });

        // Update Handlers
        const _updateHSV = (r, g, b, triggerHistory = true) => {
            const [h, s, v] = rgb2hsv(r, g, b);
            currH.value = h; currS.value = s; currV.value = v;
            if (triggerHistory) scheduleHistory();
        };

        const parseNum = (val, min, max, fallback) => {
            let num = parseFloat(val);
            if (isNaN(num)) return fallback;
            return Math.min(max, Math.max(min, num));
        };

        const onLinearChange = (comp, val) => {
            const num = parseNum(val, 0, 1, 0);
            if (comp === 'a') { currA.value = num; scheduleHistory(); return; }
            let { r, g, b } = linear.value;
            if (comp === 'r') r = num; if (comp === 'g') g = num; if (comp === 'b') b = num;
            _updateHSV(Math.round(l2s(r)*255), Math.round(l2s(g)*255), Math.round(l2s(b)*255));
        };

        const onRgbChange = (comp, val) => {
            if (comp === 'a') { currA.value = parseNum(val, 0, 100, 100) / 100; scheduleHistory(); return; }
            const num = parseNum(val, 0, 255, 0);
            let { r, g, b } = rgb.value;
            if (comp === 'r') r = num; if (comp === 'g') g = num; if (comp === 'b') b = num;
            _updateHSV(r, g, b);
        };

        const onHslChange = (comp, val) => {
            if (comp === 'a') { currA.value = parseNum(val, 0, 100, 100) / 100; scheduleHistory(); return; }
            let { h, s, l } = hsl.value;
            if (comp === 'h') h = parseNum(val, 0, 360, 0);
            if (comp === 's') s = parseNum(val, 0, 100, 0);
            if (comp === 'l') l = parseNum(val, 0, 100, 0);
            const [r, g, b] = hsl2rgb(h, s, l);
            _updateHSV(r, g, b);
        };

        const onHsvChange = (comp, val) => {
            if (comp === 'a') { currA.value = parseNum(val, 0, 100, 100) / 100; scheduleHistory(); return; }
            if (comp === 'h') currH.value = parseNum(val, 0, 360, 0);
            if (comp === 's') currS.value = parseNum(val, 0, 100, 0);
            if (comp === 'v') currV.value = parseNum(val, 0, 100, 0);
            scheduleHistory();
        };

        const onHexChange = (val, hasAlpha) => {
            let cleanHex = val.replace('#', '');
            if (/^([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(cleanHex)) {
                hexInvalid.value = false;
                if (cleanHex.length === 3) cleanHex = cleanHex.split('').map(x => x + x).join('');
                const r = parseInt(cleanHex.slice(0, 2), 16);
                const g = parseInt(cleanHex.slice(2, 4), 16);
                const b = parseInt(cleanHex.slice(4, 6), 16);
                if (cleanHex.length === 8) currA.value = parseInt(cleanHex.slice(6, 8), 16) / 255;
                _updateHSV(r, g, b);
            } else {
                hexInvalid.value = true;
                setTimeout(() => hexInvalid.value = false, 1200);
            }
        };

        // SV Drag
        const svBoxRef = ref(null);
        const moveSV = (e) => {
            if (!svBoxRef.value) return;
            const rect = svBoxRef.value.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            currS.value = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
            currV.value = Math.min(100, Math.max(0, 100 - ((clientY - rect.top) / rect.height) * 100));
        };
        const endSV = () => {
            window.removeEventListener('mousemove', moveSV); window.removeEventListener('mouseup', endSV);
            window.removeEventListener('touchmove', moveSV); window.removeEventListener('touchend', endSV);
            scheduleHistory();
        };
        const onSvDragStart = (e) => {
            moveSV(e);
            window.addEventListener('mousemove', moveSV); window.addEventListener('mouseup', endSV);
            window.addEventListener('touchmove', moveSV, { passive: false }); window.addEventListener('touchend', endSV);
        };

        // History
        const scheduleHistory = () => {
            clearTimeout(historyTimer);
            historyTimer = setTimeout(() => {
                const h = hexStr.value.replace('#', '').toLowerCase();
                colorHistory.value = colorHistory.value.filter(i => i.hex !== h);
                colorHistory.value.unshift({ h: currH.value, s: currS.value, v: currV.value, a: currA.value, hex: h, r: rgb.value.r, g: rgb.value.g, b: rgb.value.b });
                if(colorHistory.value.length > 14) colorHistory.value = colorHistory.value.slice(0, 14);
                localStorage.setItem('ue5_color_history_v61', JSON.stringify(colorHistory.value));
            }, 1000);
        };
        const applyHistory = (item) => { currH.value = item.h; currS.value = item.s; currV.value = item.v; currA.value = item.a; };
        const clearHistory = () => { colorHistory.value = []; localStorage.removeItem('ue5_color_history_v61'); };

        // Copy
        const copy = async (type) => {
            let text = "";
            if (type === 'linear') text = enableAlpha.linear ? `(R=${linear.value.r}, G=${linear.value.g}, B=${linear.value.b}, A=${linear.value.a})` : `(R=${linear.value.r}, G=${linear.value.g}, B=${linear.value.b})`;
            else if (type === 'srgb') text = enableAlpha.rgb ? `rgba(${rgb.value.r}, ${rgb.value.g}, ${rgb.value.b}, ${currA.value})` : `rgb(${rgb.value.r}, ${rgb.value.g}, ${rgb.value.b})`;
            else if (type === 'hex') text = enableAlpha.hex ? hexAlphaStr.value : hexStr.value;
            else if (type === 'hsl') text = enableAlpha.hsl ? `hsla(${Math.round(currH.value)}, ${hsl.value.s}, ${hsl.value.l}, ${currA.value})` : `hsl(${Math.round(currH.value)}, ${hsl.value.s}, ${hsl.value.l})`;
            else if (type === 'hsv') text = enableAlpha.hsv ? `hsva(${Math.round(currH.value)}, ${Math.round(currS.value)}, ${Math.round(currV.value)}, ${currA.value})` : `hsv(${Math.round(currH.value)}, ${Math.round(currS.value)}, ${Math.round(currV.value)})`;

            try {
                await navigator.clipboard.writeText(text);
                copyStatus.value = type;
                setTimeout(() => copyStatus.value = null, 1200);
            } catch (err) { console.error('Copy failed', err); }
        };

        onMounted(() => { initLang(); window.addEventListener('click', () => isLangDropdownOpen.value = false); });

        return {
            t, currentLangObj, supportedLangs, isLangDropdownOpen, setLanguage,
            currH, currS, currV, currA, alphaPercent, alphaGradient, cssRgba,
            rgb, hsl, linear, hexStr, hexAlphaStr, hexPrefs, hexInvalid,
            svBoxRef, onSvDragStart, copyStatus, copy, enableAlpha,
            onLinearChange, onRgbChange, onHslChange, onHsvChange, onHexChange,
            colorHistory, scheduleHistory, applyHistory, clearHistory
        };
    }
}).mount('#app');
