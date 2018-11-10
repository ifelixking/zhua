#include "stdafx.h"
#include "MainWindow.h"
#include "DlgNavigate.h"

MainWindow::MainWindow(QWidget * parent)
	: QMainWindow(parent)
	// 	, m_injectState(IS_NOTYET)
	, m_view(new QWebEngineView(this))
	, m_injectScriptID(QUuid::createUuid().toString())
{

	this->initMenu();

	setCentralWidget(m_view);
	connect(m_view, &QWebEngineView::loadFinished, this, &MainWindow::onViewLoadFinished);
	connect(m_view, &QWebEngineView::loadProgress, this, &MainWindow::onViewLoadProgress);
	connect(m_view, &QWebEngineView::loadStarted, this, &MainWindow::onViewLoadStarted);
	m_view->show();
	
	m_view->load(QUrl("http://www.csdn.net"));
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

	// [�ļ�]
	{
		auto mfile = bar->addMenu(QString::fromLocal8Bit("�ļ�(&F)"));

		auto mEdit = bar->addMenu(QString::fromLocal8Bit("�༭(&E)"));
		auto aNavi = mEdit->addAction(QString::fromLocal8Bit("����ַ(&N)..."));
		connect(aNavi, &QAction::triggered, this, &MainWindow::slotNavigate);
		auto aDevTool = mEdit->addAction(QString::fromLocal8Bit("DevTools(&D)..."));
		connect(aDevTool, &QAction::triggered, this, &MainWindow::slotShowDevTool);
	}

	//// Toolbar 
	//auto toolBar = addToolBar("toolbar");//����������
	//toolBar->addAction(aNew);//��������Ӳ˵���--��ݼ�
	//QPushButton * b = new QPushButton(this);
	//b->setText("OK");
	//toolBar->addWidget(b);//����������������--��ť


	// ״̬��
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
		//mBar->addWidget(lable);//״̬��������
		//mBar->addWidget(new QLabel("2", this));//addWidget:�����������
		//mBar->addPermanentWidget(new QLabel("3", this));//addPermanentWidget�������������
	}

}

void MainWindow::slotNavigate() {
	QString url = DlgNavigate::ShowNavigateDialog();
	if (url.isEmpty()) { return; }
	m_view->load(QUrl(url));
}

void MainWindow::inject() {
	// qDebug() << "--------------------- Inject";	
	auto script = QString("(function(){ if (document.getElementById('%1')) return; if (!document.body) return; var s=document.createElement('script');s.id='%1';s.src='http://localhost:80/injection/js/index.js';document.body.append(s)})()").arg(m_injectScriptID);
	// InjectStates * state = &this->m_injectState;
	m_view->page()->runJavaScript(script/*, [state](const QVariant & result) {*state = result == true ? IS_SUCCESSED : IS_FAILED;}*/);
}

void MainWindow::slotShowDevTool() {
	QWebEngineView * pdev = new QWebEngineView();
	pdev->setUrl(QUrl("about:blank"));
	pdev->show();
	m_view->page()->setDevToolsPage(pdev->page());
}