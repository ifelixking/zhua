#include "stdafx.h"
#include "MainWindow.h"
#include "DlgNavigate.h"

MainWindow::MainWindow(QWidget * parent)
	: QMainWindow(parent)
// 	, m_injectState(IS_NOTYET)
{
	this->initMenu();

	m_view = new QWebEngineView(this);
	setCentralWidget(m_view);
	connect(m_view, &QWebEngineView::loadFinished, this, &MainWindow::onViewLoadFinished);
	connect(m_view, &QWebEngineView::loadProgress, this, &MainWindow::onViewLoadProgress);
	connect(m_view, &QWebEngineView::loadStarted, this, &MainWindow::onViewLoadStarted);
	m_view->show();

	m_view->load(QUrl("http://www.baidu.com"));
}

MainWindow::~MainWindow() {

}

void MainWindow::onViewLoadStarted() {
//	m_injectState = IS_NOTYET;
	qDebug() << "--------------------- Start";
}

void MainWindow::onViewLoadProgress(int progress) {
	qDebug() << "--------------------- " << progress;
//	if (m_injectState == IS_NOTYET || m_injectState == IS_FAILED){
		inject();
//		m_injectState = IS_INJECTING;
//	}
}

void MainWindow::onViewLoadFinished(bool ok)
{
	qDebug() << "--------------------- Finish";
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


	//// status bar
	//QStatusBar * sBar = statusBar();//创建状态栏
	//QLabel *lable = new QLabel(this);
	//lable->setText("Normal text file");
	//sBar->addWidget(lable);//状态栏添加组件
	//sBar->addWidget(new QLabel("2", this));//addWidget:从左往右添加
	//sBar->addPermanentWidget(new QLabel("3", this));//addPermanentWidget：从右往左添加


}

void MainWindow::slotNavigate() {
	QString url = DlgNavigate::ShowNavigateDialog();
	if (url.isEmpty()) { return; }
	m_view->load(QUrl(url));
}

void MainWindow::inject() {
	qDebug() << "--------------------- Inject";
	QString script = "(function(){ if (document.getElementById('showmethemoney')) return; if (!document.body) return; var s=document.createElement('script');s.id='showmethemoney';s.src='http://localhost/injection/js/index.js';document.body.append(s)})()";
	// InjectStates * state = &this->m_injectState;
	m_view->page()->runJavaScript(script/*, [state](const QVariant & result) {*state = result == true ? IS_SUCCESSED : IS_FAILED;}*/);
}

void MainWindow::slotShowDevTool(){
	QWebEngineView * pdev = new QWebEngineView();
	pdev->setUrl(QUrl("about:blank"));
	pdev->show();
	m_view->page()->setDevToolsPage(pdev->page());
}