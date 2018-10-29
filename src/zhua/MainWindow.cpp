#include "stdafx.h"
#include "MainWindow.h"

MainWindow::MainWindow(QWidget * parent)
	:QMainWindow(parent)
{
	// Menu
	QMenuBar * bar = this->menuBar();
	auto file = bar->addMenu(QString::fromLocal8Bit("�ļ�"));
	auto aNew = file->addAction(QString::fromLocal8Bit("�½�"));

	connect(aNew, &QAction::triggered, [](){
		int aaa = 0;
	});

	// Toolbar 
	auto toolBar = addToolBar("toolbar");//����������
	toolBar->addAction(aNew);//��������Ӳ˵���--��ݼ�
	QPushButton * b = new QPushButton(this);
	b->setText("OK");
	toolBar->addWidget(b);//����������������--��ť


	// status bar
	QStatusBar * sBar = statusBar();//����״̬��
	QLabel *lable = new QLabel(this);
	lable->setText("Normal text file");
	sBar->addWidget(lable);//״̬��������
	sBar->addWidget(new QLabel("2", this));//addWidget:�����������

	sBar->addPermanentWidget(new QLabel("3", this));//addPermanentWidget�������������


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