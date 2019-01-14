#include "stdafx.h"
#include "MainWindow.h"
#include "DlgNavigate.h"
#include "DlgNative.h"


// 运行不安全的 https
class CustomWebEnginePage : public QWebEnginePage
{
public:
	CustomWebEnginePage(QWidget * parent) : QWebEnginePage(parent) {}
	virtual bool certificateError(const QWebEngineCertificateError &certificateError) { return true; }
};

// ================================================================================================
MainWindow::MainWindow(QWidget * parent)
	: QMainWindow(parent)
	, m_view(new QWebEngineView(this))
	, m_injectScriptID(QUuid::createUuid().toString())
	, m_urlHome("https://www.zhua.com")
{

	QWebEngineProfile* defaultProfile = QWebEngineProfile::defaultProfile();
	defaultProfile->setCachePath("d:\\qq\\coo");
	defaultProfile->setPersistentStoragePath("d:\\qq\\ss");
	defaultProfile->setPersistentCookiesPolicy(QWebEngineProfile::ForcePersistentCookies);
	m_view->setPage(new CustomWebEnginePage(m_view));

	setCentralWidget(m_view);
	connect(m_view, &QWebEngineView::loadFinished, this, &MainWindow::onViewLoadFinished);
	connect(m_view, &QWebEngineView::loadProgress, this, &MainWindow::onViewLoadProgress);
	connect(m_view, &QWebEngineView::loadStarted, this, &MainWindow::onViewLoadStarted);

	QWebChannel *pWebChannel = new QWebChannel(m_view->page());
	pWebChannel->registerObject(QString("Zhua"), this);
	m_view->page()->setWebChannel(pWebChannel);

	this->initMenu();
	m_view->show();
	m_view->load(m_urlHome);
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
		auto aHome = mfile->addAction(QString::fromLocal8Bit("主页(&H)"));
		connect(aHome, &QAction::triggered, this, &MainWindow::slotHome);

		auto mEdit = bar->addMenu(QString::fromLocal8Bit("编辑(&E)"));
		auto aNavi = mEdit->addAction(QString::fromLocal8Bit("打开网址(&N)..."));
		connect(aNavi, &QAction::triggered, this, &MainWindow::slotNavigate);
		auto aDevTool = mEdit->addAction(QString::fromLocal8Bit("DevTools(&D)..."));
		connect(aDevTool, &QAction::triggered, this, &MainWindow::slotShowDevTool);
		auto aNativeStorage = mEdit->addAction(QString::fromLocal8Bit("NativeStorage(&N)..."));
		connect(aNativeStorage, &QAction::triggered, this, &MainWindow::slotShowNativeStorage);
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
	if (m_view->url().host() == m_urlHome.host()) { return; }
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

void MainWindow::slotHome() {
	m_view->load(m_urlHome);
}

QString MainWindow::getInfo(QString a, QString b) {
	auto kk = a.toStdWString();
	auto kk1 = b.toStdWString();
	return QString(a + b);
}

void MainWindow::save(QString key, QString data) {
#ifdef _DEBUG
	auto k = key.toStdWString();
	auto v = data.toStdWString();
#endif 
	m_mapData[key] = data;
}

QString MainWindow::load(QString key) {
	auto itor = m_mapData.find(key);
	if (itor == m_mapData.end()) { return QString(""); }
	return itor.value();
}

void MainWindow::slotShowNativeStorage() {
	DlgNative::ShowNativeDialog(this->m_mapData);
}

QString MainWindow::openSaveFileDialog(QString oldFilename){
	QString fileName = QFileDialog::getSaveFileName(this, QString::fromLocal8Bit("保存到..."), oldFilename, QString("Excel CSV (*.csv)"));
	return fileName;
}