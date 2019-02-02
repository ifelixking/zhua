#include "stdafx.h"
#include "MainWindow.h"
#include "DlgNavigate.h"
#include "DlgNative.h"

// ������ȫ�� https
class CustomWebEnginePage : public QWebEnginePage
{
public:
	CustomWebEnginePage(QWidget * parent) : QWebEnginePage(parent) {}
	~CustomWebEnginePage() {
		int aa = 0;
	}
	virtual bool certificateError(const QWebEngineCertificateError &certificateError) { return true; }
};

template<typename T>
class AutoDelete
{
private:
	T * m_obj;
public:
	AutoDelete<T>(T * obj) : m_obj(obj) {}
	~AutoDelete<T>() { delete m_obj; }
};
class AutoFalse
{
private:
	bool & m_value;
public:
	AutoFalse(bool & value) : m_value(value) {}
	~AutoFalse() { m_value = false; }
};


// ================================================================================================

QString ChannelObject::getInfo(QString a, QString b) {
	auto kk = a.toStdWString();
	auto kk1 = b.toStdWString();
	return QString(a + b);
}

void ChannelObject::save(QString key, QString data) {
#ifdef _DEBUG 
	auto k = key.toStdWString();
	auto v = data.toStdWString();
#endif 
	m_mapData[key] = data;
}

QString ChannelObject::load(QString key) {
	auto itor = m_mapData.find(key);
	if (itor == m_mapData.end()) { return QString(""); }
	return itor.value();
}

QString ChannelObject::openSaveFileDialog(QString oldFilename) {
	QString fileName = QFileDialog::getSaveFileName(m_mainWindow, QString::fromLocal8Bit("���浽..."), oldFilename, QString::fromLocal8Bit("Microsoft Excel (*.xlsx);;CSV (*.csv);;�����ļ� (*.*)"));
	return fileName;
}

void ChannelObject::exportToExcel(QString filename, QString jsonColumns, QString jsonRows, bool append) {
	auto columns = QJsonDocument::fromJson(jsonColumns.toUtf8()).array();
	auto rows = QJsonDocument::fromJson(jsonRows.toUtf8()).array();
	doExportToExcel(filename, columns, rows, append);
}

void ChannelObject::doExportToExcel(QString filename, QJsonArray columns, QJsonArray rows, bool append) {
	{
		bool isAppend = append;

		QAxObject * app = new QAxObject(this); AutoDelete<QAxObject> _app(app);
		app->setControl("Excel.Application");
		app->dynamicCall("SetVisible (bool Visible)", "false");
		app->setProperty("DisplayAlerts", false);

		QAxObject *workbooks = app->querySubObject("WorkBooks");
		QAxObject * workbook;
		// ���Դ� filename, ��� filename ������ �� ���ǺϷ��� excel ��ʽ, workbook ��Ϊ NULL
		if (append) {
			workbook = workbooks->querySubObject("Open(const QString&)", filename);
		}
		if (workbook == NULL) {
			isAppend = false;
			workbooks->dynamicCall("Add");
			workbook = app->querySubObject("ActiveWorkBook");
		}


		QAxObject *worksheets = workbook->querySubObject("Sheets");
		QAxObject *worksheet = worksheets->querySubObject("Item(int)", 1);

		int rowOffset, colOffset;
		QMap<QString, int> mapColumn;
		if (!isAppend) {
			// columns
			for (int i = 0; i < columns.count(); ++i) {
				auto cell = worksheet->querySubObject("Cells(int, int)", 1, i + 1);
				auto col = columns.at(i).toObject();
				auto title = col["title"].toString();
				auto key = col["key"].toString();
				auto width = col["width"].toInt();
				cell->dynamicCall("SetValue(const QVariant&)", QVariant(title));
				cell->setProperty("ColumnWidth", width);
				auto font = cell->querySubObject("Font");
				font->setProperty("Bold", true);
				font->setProperty("Size", 12);
				mapColumn.insert(key, i + 1);
			}
			rowOffset = 2;
			colOffset = 0;
		}
		else {
			for (int i = 0; i < columns.count(); ++i) {
				auto col = columns.at(i).toObject();
				auto key = col["key"].toString();
				mapColumn.insert(key, i + 1);
			}

			// ���� offset
			QAxObject* usedrange = worksheet->querySubObject("UsedRange"); //!  sheet ��Χ
			int intRowStart = usedrange->property("Row").toInt(); //!  ��ʼ����
			int intColStart = usedrange->property("Column").toInt(); //!  ��ʼ������
			QAxObject *rows, *columns;
			rows = usedrange->querySubObject("Rows"); //! �С�
			columns = usedrange->querySubObject("Columns"); //! ��
			int intRow = rows->property("Count").toInt(); //! ����
			int intCol = columns->property("Count").toInt();  //!  ����
			colOffset = intColStart - 1;
			rowOffset = intRowStart + intRow;
		}

		// rows
		{

			for (int i = 0; i < rows.count(); ++i) {
				auto obj = rows.at(i).toObject();
				for (auto itor = obj.begin(); itor != obj.end(); ++itor) {
					auto itorFind = mapColumn.find(itor.key()); if (itorFind == mapColumn.end()) { continue; }
					auto colIdx = itorFind.value();
					auto cell = worksheet->querySubObject("Cells(int, int)", i + rowOffset, colOffset + colIdx);	// TODO: ���� A,B,C...Z ֮�󲻹��õ����
					auto value = itor.value().toString();
					cell->dynamicCall("SetValue(const QVariant&)", value);
					auto font = cell->querySubObject("Font");
					font->setProperty("Size", 12);
				}
			}
		}

		workbook->dynamicCall("SaveAs(const QString&)", QDir::toNativeSeparators(filename));
		workbook->dynamicCall("Close()");
		app->dynamicCall("Quit()");
	}
	QMessageBox::information(m_mainWindow, "title", "comment");

}

// ================================================================================================
MainWindow::MainWindow(QWidget * parent)
	: QMainWindow(parent)
	, m_injectScriptID(QUuid::createUuid().toString())
	, m_urlHome("https://www.zhua.com")
	, m_isRunning(false)
	, m_isLoaded(false)
{
	m_view = new WebEngineView(this);

	QWebEngineProfile* defaultProfile = QWebEngineProfile::defaultProfile();
	defaultProfile->setCachePath("./cache");
	defaultProfile->setPersistentStoragePath("./storage");
	defaultProfile->setPersistentCookiesPolicy(QWebEngineProfile::ForcePersistentCookies);
	m_view->setPage(new CustomWebEnginePage(m_view));

	setCentralWidget(m_view);
	connect(m_view, &QWebEngineView::loadFinished, this, &MainWindow::onViewLoadFinished);
	//connect(m_view, &QWebEngineView::loadProgress, this, &MainWindow::onViewLoadProgress);
	//connect(m_view, &QWebEngineView::loadStarted, this, &MainWindow::onViewLoadStarted);

	m_channelObject = new ChannelObject(this);
	QWebChannel *pWebChannel = new QWebChannel(m_view->page());
	pWebChannel->registerObject(QString("Zhua"), m_channelObject);
	m_view->page()->setWebChannel(pWebChannel);
	connect(m_channelObject, &ChannelObject::start, this, &MainWindow::doStart, Qt::QueuedConnection);

	this->initMenu();
	m_view->load(m_urlHome);
	m_view->show();
}

MainWindow::~MainWindow() {
	delete m_channelObject;
}

//void MainWindow::onViewLoadStarted() {
//	//	m_injectState = IS_NOTYET;
//	//	qDebug() << "--------------------- Start";m_view(new WebEngineView(this))
//}
//
//void MainWindow::onViewLoadProgress(int progress) {
//	//	qDebug() << "--------------------- " << progress;
//	//	if (m_injectState == IS_NOTYET || m_injectState == IS_FAILED){
//	m_isLoaded = inject();
//	//		m_injectState = IS_INJECTING;
//	//	}
//}

void MainWindow::onViewLoadFinished(bool ok)
{
	m_isLoaded = true;
	qDebug() << "--------------------- Finish : " << m_view->url().toString();
	if (m_isRunning) { return; }
	inject();
}

void MainWindow::initMenu() {
	// Menu
	QMenuBar * bar = this->menuBar();

	// [�ļ�]
	{
		auto mfile = bar->addMenu(QString::fromLocal8Bit("�ļ�(&F)"));
		auto aHome = mfile->addAction(QString::fromLocal8Bit("��ҳ(&H)"));
		connect(aHome, &QAction::triggered, this, &MainWindow::slotHome);

		auto mEdit = bar->addMenu(QString::fromLocal8Bit("�༭(&E)"));
		auto aNavi = mEdit->addAction(QString::fromLocal8Bit("����ַ(&N)..."));
		connect(aNavi, &QAction::triggered, this, &MainWindow::slotNavigate);
		auto aDevTool = mEdit->addAction(QString::fromLocal8Bit("DevTools(&D)..."));
		connect(aDevTool, &QAction::triggered, this, &MainWindow::slotShowDevTool);
		auto aNativeStorage = mEdit->addAction(QString::fromLocal8Bit("NativeStorage(&N)..."));
		connect(aNativeStorage, &QAction::triggered, this, &MainWindow::slotShowNativeStorage);
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

bool MainWindow::inject() {
	if (m_view->url().host() == m_urlHome.host()) { return false; }
	QString src = "https://www.zhua.com/injection/js/index.js";
	return injectScriptSrc(src);
}

bool MainWindow::injectScriptSrc(QString src) {
	auto script = QString("(function(){ if (document.getElementById('%1')) return true; if (!document.body) return false; var s=document.createElement('script');s.id='%1';s.src='%2';document.body.append(s); return true})()").arg(m_injectScriptID, src);
	QVariant result = runScript(script);
	return result.toBool();
}

QVariant MainWindow::runScript(QString script) {
	QVariant execResult; QVariant * pExecResult = &execResult;
	volatile bool execReturn = false; volatile bool * pExecReturn = &execReturn;
	m_view->page()->runJavaScript(script, [pExecResult, pExecReturn](const QVariant & result) {
		*pExecResult = result;
		*pExecReturn = true;
	});
	for (; !execReturn;) { QCoreApplication::processEvents(); }		// ǿ�Ƶȴ� runJavaScript ����
	return execResult;
}

QVariant MainWindow::runScript2(QString script) {
	for (;;) {
		QVariant result = runScript(script);
		if (result.toString() != "__FAILED__") { return result; }
		QCoreApplication::processEvents();
	}
}

void MainWindow::slotShowDevTool() {
	QWebEngineView * pdev = new QWebEngineView();
	pdev->setUrl(QUrl("about:blank"));
	pdev->show();
	m_view->page()->setDevToolsPage(pdev->page());
}

void MainWindow::slotHome() {

	QString info;
	info += "url:" + m_view->url().toString();
	QMessageBox::information(this, "info", info);

	// m_view->load(m_urlHome);

	//QString filepath = QFileDialog::getSaveFileName(this, tr("Save orbit"), ".", tr("Microsoft Office 2007 (*.xlsx)"));//��ȡ����·��
	//if (!filepath.isEmpty()) {
	//	QAxObject *excel = new QAxObject(this);
	//	excel->setControl("Excel.Application");//����Excel�ؼ�
	//	excel->dynamicCall("SetVisible (bool Visible)", "false");//����ʾ����
	//	excel->setProperty("DisplayAlerts", false);//����ʾ�κξ�����Ϣ�����Ϊtrue��ô�ڹر��ǻ�������ơ��ļ����޸ģ��Ƿ񱣴桱����ʾ

	//	QAxObject *workbooks = excel->querySubObject("WorkBooks");//��ȡ����������
	//	workbooks->dynamicCall("Add");//�½�һ��������
	//	QAxObject *workbook = excel->querySubObject("ActiveWorkBook");//��ȡ��ǰ������
	//	QAxObject *worksheets = workbook->querySubObject("Sheets");//��ȡ��������
	//	QAxObject *worksheet = worksheets->querySubObject("Item(int)", 1);//��ȡ�������ϵĹ�����1����sheet1

	//	QAxObject *cellA, *cellB, *cellC, *cellD;

	//	//���ñ���
	//	int cellrow = 1;
	//	QString A = "A" + QString::number(cellrow);//����Ҫ�����ĵ�Ԫ����A1
	//	QString B = "B" + QString::number(cellrow);
	//	QString C = "C" + QString::number(cellrow);
	//	QString D = "D" + QString::number(cellrow);
	//	cellA = worksheet->querySubObject("Range(QVariant, QVariant)", A);//��ȡ��Ԫ��
	//	cellB = worksheet->querySubObject("Range(QVariant, QVariant)", B);
	//	cellC = worksheet->querySubObject("Range(QVariant, QVariant)", C);
	//	cellD = worksheet->querySubObject("Range(QVariant, QVariant)", D);
	//	cellA->dynamicCall("SetValue(const QVariant&)", QVariant(QString::fromLocal8Bit("��ˮ��")));//���õ�Ԫ���ֵ
	//	cellB->dynamicCall("SetValue(const QVariant&)", QVariant(QString::fromLocal8Bit("�û���")));
	//	cellC->dynamicCall("SetValue(const QVariant&)", QVariant(QString::fromLocal8Bit("���")));
	//	cellD->dynamicCall("SetValue(const QVariant&)", QVariant(QString::fromLocal8Bit("����")));
	//	cellrow++;

	//	// int rows = this->model->rowCount();
	//	// for (int i = 0; i < rows; i++) {
	//	{
	//		QString A = "A" + QString::number(cellrow);//����Ҫ�����ĵ�Ԫ����A1
	//		QString B = "B" + QString::number(cellrow);
	//		QString C = "C" + QString::number(cellrow);
	//		QString D = "D" + QString::number(cellrow);
	//		cellA = worksheet->querySubObject("Range(QVariant, QVariant)", A);//��ȡ��Ԫ��
	//		cellB = worksheet->querySubObject("Range(QVariant, QVariant)", B);
	//		cellC = worksheet->querySubObject("Range(QVariant, QVariant)", C);
	//		cellD = worksheet->querySubObject("Range(QVariant, QVariant)", D);
	//		cellA->dynamicCall("SetValue(const QVariant&)", QVariant("felix"));//���õ�Ԫ���ֵ
	//		cellB->dynamicCall("SetValue(const QVariant&)", QVariant("mary"));
	//		cellC->dynamicCall("SetValue(const QVariant&)", QVariant("victoria"));
	//		cellD->dynamicCall("SetValue(const QVariant&)", QVariant("hugo"));
	//	}
	//	//	cellrow++;
	//// }

	//	workbook->dynamicCall("SaveAs(const QString&)", QDir::toNativeSeparators(filepath));//������filepath��ע��һ��Ҫ��QDir::toNativeSeparators��·���е�"/"ת��Ϊ"\"����Ȼһ�����治�ˡ�
	//	workbook->dynamicCall("Close()");//�رչ�����
	//	excel->dynamicCall("Quit()");//�ر�excel
	//	delete excel;
	//	excel = NULL;
	//}
}

void MainWindow::slotShowNativeStorage() {
	DlgNative::ShowNativeDialog(this->m_channelObject->m_mapData);
}

void MainWindow::doStart() {

	QJsonObject actionStore; {
		auto itorFind = m_channelObject->m_mapData.find("project"); if (itorFind == m_channelObject->m_mapData.end()) { return; }
		auto jsonProject = itorFind.value();
		QJsonObject project = QJsonDocument::fromJson(jsonProject.toUtf8()).object();
		actionStore = QJsonDocument::fromJson(project["data"].toString().toUtf8()).object();
	}

	int startActionId = actionStore["start"].toInt();
	QJsonArray actions = actionStore["actions"].toArray();
	m_isRunning = true; AutoFalse _autoFalse(m_isRunning);
	runGroup(startActionId, actions);
}

void MainWindow::runGroup(int startId, const QJsonArray & actions) {
	QVector<QJsonObject> vecAction(actions.count());
	int startIdx = -1;
	for (auto itor = actions.begin(); itor != actions.end(); ++itor) {
		vecAction.push_back(itor->toObject());
		const QJsonObject & obj = vecAction.back();
		if (obj["id"].toInt() == startId) { startIdx = vecAction.count() - 1; }
	} if (startIdx == -1) { return; }

	for (const QJsonObject * action = &vecAction.at(startIdx);;) {
		if (!run(*action)) { break; }
		auto itorFind_nextId = action->find("next"); if (itorFind_nextId == action->end()) { break; }
		int nextId = itorFind_nextId.value().toInt();
		auto itorFind = std::find_if(vecAction.begin(), vecAction.end(), [nextId](const QJsonObject & obj) {return obj["id"].toInt() == nextId; });
		if (itorFind == vecAction.end()) { break; }
		action = &*itorFind;
	}
}

bool MainWindow::run(const QJsonObject & action) {
	auto type = action["type"].toString();
	if (type == "open-url") {
		auto jsData = action["data"].toObject();
		auto url = jsData["url"].toString();
		m_isLoaded = false;
		m_view->load(url);
		for (;;) {
			QCoreApplication::processEvents();
			if (m_isLoaded) { break; }
		}
		return true;
	}
	else if (type == "fetch-table") {
		QString src = "https://www.zhua.com/run/js/index.js";
		injectScriptSrc(src);
		auto jsData = action["data"].toObject();
		QJsonDocument document; document.setObject(jsData);
		QString script = QString("(function(){ if (!window.fetchTable) { return '__FAILED__' } return fetchTable('%1') })()").arg(QString(document.toJson(QJsonDocument::Compact)));
		QVariant result = runScript2(script);
		QJsonObject jsResult = QJsonDocument::fromJson(result.toString().toUtf8()).object();
		auto filename = jsData["export"].toString();
		m_channelObject->doExportToExcel(filename, jsResult["columns"].toArray(), jsResult["rows"].toArray(), true);
		return false;
	}

	return false;

}

QWebEngineView *WebEngineView::createWindow(QWebEnginePage::WebWindowType type) {
	this->setPage(new CustomWebEnginePage(this));
	QWebChannel *pWebChannel = new QWebChannel(this->page());
	pWebChannel->registerObject(QString("Zhua"), this);
	this->page()->setWebChannel(pWebChannel);
	return this;
}