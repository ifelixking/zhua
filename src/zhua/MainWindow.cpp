#include "stdafx.h"
#include "MainWindow.h"

MainWindow::MainWindow(QWidget * parent)
	:QMainWindow(parent)
{
	// Menu
	QMenuBar * bar = this->menuBar();
	auto file = bar->addMenu(QString::fromLocal8Bit("文件"));
	auto aNew = file->addAction(QString::fromLocal8Bit("新建"));

	connect(aNew, &QAction::triggered, [](){
		int aaa = 0;
	});

	// Toolbar 
	auto toolBar = addToolBar("toolbar");//创建工具栏
	toolBar->addAction(aNew);//工具栏添加菜单项--快捷键
	QPushButton * b = new QPushButton(this);
	b->setText("OK");
	toolBar->addWidget(b);//工具栏添加其他组件--按钮


	// status bar
	QStatusBar * sBar = statusBar();//创建状态栏
	QLabel *lable = new QLabel(this);
	lable->setText("Normal text file");
	sBar->addWidget(lable);//状态栏添加组件
	sBar->addWidget(new QLabel("2", this));//addWidget:从左往右添加

	sBar->addPermanentWidget(new QLabel("3", this));//addPermanentWidget：从右往左添加


	m_view = new QWebEngineView(this);
	setCentralWidget(m_view);
	m_view->load(QUrl("http://www.baidu.com"));
	m_view->show();	
}

MainWindow::~MainWindow() {

}

void MainWindow::resizeEvent(QResizeEvent *)
{
	// m_view->resize(this->size());
}