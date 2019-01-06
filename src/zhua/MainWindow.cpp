#include "stdafx.h"
#include "MainWindow.h"
#include "DlgNavigate.h"

class CustomWebEnginePage : public QWebEnginePage
{
public:
	CustomWebEnginePage() {}
	virtual bool certificateError(const QWebEngineCertificateError &certificateError) { return true; }
};

MainWindow::MainWindow(QWidget * parent)
	: QMainWindow(parent)
	// 	, m_injectState(IS_NOTYET)
	, m_view(new QWebEngineView(this))
	, m_injectScriptID(QUuid::createUuid().toString())
{

	QWebEngineProfile* defaultProfile = QWebEngineProfile::defaultProfile();
	defaultProfile->setCachePath("d:\\qq\\coo");
	defaultProfile->setPersistentStoragePath("d:\\qq\\ss");
	defaultProfile->setPersistentCookiesPolicy(QWebEngineProfile::ForcePersistentCookies);

	this->initMenu();



	//QUrl url;
	//// QWebEngineView *webView = new QWebEngineView();
	//QNetworkAccessManager * networkManager = new QNetworkAccessManager();
	//QNetworkCookieJar * cookieJar = networkManager->cookieJar();;
	//QList<QNetworkCookie> cookies = cookieJar->cookiesForUrl(strUrl);
	//QWebEngineCookieStore *cookieStore = webView->page()->profile()->cookieStore();
	//cookieStore->setCookie(cookies.front(), url);
	//webView->page()->load(url);
	//webView->show();






	m_view->setPage(new CustomWebEnginePage());


	

	m_view->page()->profile()->cookieStore()->setCookieFilter([](const QWebEngineCookieStore::FilterRequest &request)->bool {


		auto a = request.origin.toString().toStdWString();
		auto b = request.firstPartyUrl.toString().toStdWString();

		return true;
	});





	setCentralWidget(m_view);
	connect(m_view, &QWebEngineView::loadFinished, this, &MainWindow::onViewLoadFinished);
	connect(m_view, &QWebEngineView::loadProgress, this, &MainWindow::onViewLoadProgress);
	connect(m_view, &QWebEngineView::loadStarted, this, &MainWindow::onViewLoadStarted);

	connect(m_view->page()->profile()->cookieStore(), &QWebEngineCookieStore::cookieAdded, this, &MainWindow::cookieAdded);
	connect(m_view->page()->profile()->cookieStore(), &QWebEngineCookieStore::cookieAdded, this, &MainWindow::cookieAdded);

	m_view->show();

	m_view->load(QUrl("https://www.zhua.com"));
}

void	MainWindow::cookieAdded(const QNetworkCookie &cookie) {

	auto name = QString(cookie.name()).toStdWString();
	auto value = QString(cookie.value()).toStdWString();

	// m_view->page()->profile()->cookieStore()->setCookie(cookie);

	int	aa = 0;
}
void	MainWindow::cookieRemoved(const QNetworkCookie &cookie) {
	int	aa = 0;
}

MainWindow::~MainWindow() {

}

void MainWindow::onViewLoadStarted() {
	//	m_injectState = IS_NOTYET;
	//	qDebug() << "--------------------- Start";
}

void MainWindow::onViewLoadProgress(int progress) {
	//	qDebug() << "--------------------- " << progress;
	//	if (m_injectState == IS_NOTYET || m_injectState == IS_FAILED){
	inject();
	//		m_injectState = IS_INJECTING;
	//	}
}

void MainWindow::onViewLoadFinished(bool ok)
{
	//	qDebug() << "--------------------- Finish";
	//	if (m_injectState == IS_NOTYET || m_injectState == IS_FAILED) {
	inject();
	//		m_injectState = IS_INJECTING;
	//	}
}

void MainWindow::initMenu() {
	// Menu
	QMenuBar * bar = this->menuBar();

	// [文件]
	{
		auto mfile = bar->addMenu(QString::fromLocal8Bit("文件(&F)"));

		auto mEdit = bar->addMenu(QString::fromLocal8Bit("编辑(&E)"));
		auto aNavi = mEdit->addAction(QString::fromLocal8Bit("打开网址(&N)..."));
		connect(aNavi, &QAction::triggered, this, &MainWindow::slotNavigate);
		auto aDevTool = mEdit->addAction(QString::fromLocal8Bit("DevTools(&D)..."));
		connect(aDevTool, &QAction::triggered, this, &MainWindow::slotShowDevTool);
	}

	//// Toolbar 
	//auto toolBar = addToolBar("toolbar");//创建工具栏
	//toolBar->addAction(aNew);//工具栏添加菜单项--快捷键
	//QPushButton * b = new QPushButton(this);
	//b->setText("OK");
	//toolBar->addWidget(b);//工具栏添加其他组件--按钮


	// 状态栏
	auto mBar = this->statusBar();
	{

		auto aProgress = new QProgressBar(this); aProgress->setFixedSize(100, 16); aProgress->setTextVisible(false);
		connect(m_view, &QWebEngineView::loadProgress, [aProgress](int progress) {
			aProgress->setValue(progress);
			if (progress >= 100) { aProgress->hide(); }
			else { aProgress->show(); }
		});
		mBar->addWidget(aProgress); aProgress->hide();

		//QLabel *lable = new QLabel(this);
		//lable->setText("Normal text file");
		//mBar->addWidget(lable);//状态栏添加组件
		//mBar->addWidget(new QLabel("2", this));//addWidget:从左往右添加
		//mBar->addPermanentWidget(new QLabel("3", this));//addPermanentWidget：从右往左添加
	}

}

void MainWindow::slotNavigate() {
	QString url = DlgNavigate::ShowNavigateDialog();
	if (url.isEmpty()) { return; }
	m_view->load(QUrl(url));
}

void MainWindow::inject() {
	// qDebug() << "--------------------- Inject";	
	auto script = QString("(function(){ if (document.getElementById('%1')) return; if (!document.body) return; var s=document.createElement('script');s.id='%1';s.src='https://www.zhua.com/injection/js/index.js';document.body.append(s)})()").arg(m_injectScriptID);
	// InjectStates * state = &this->m_injectState;
	m_view->page()->runJavaScript(script/*, [state](const QVariant & result) {*state = result == true ? IS_SUCCESSED : IS_FAILED;}*/);
}

void MainWindow::slotShowDevTool() {
	QWebEngineView * pdev = new QWebEngineView();
	pdev->setUrl(QUrl("about:blank"));
	pdev->show();
	m_view->page()->setDevToolsPage(pdev->page());
}