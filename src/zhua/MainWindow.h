#pragma once

class MainWindow : public QMainWindow {
	Q_OBJECT

public:
	explicit MainWindow(QWidget * parent = nullptr);
	~MainWindow();

private:
	void initMenu();
	void onViewLoadFinished(bool ok);
	// void onViewLoadProgress(int progress);
	// void onViewLoadStarted();
	void slotNavigate();
	void slotHome();
	bool inject();
	bool injectScriptSrc(QString src);
	QVariant runScript(QString script);
	QVariant runScript2(QString script);

	void slotShowDevTool();
	void slotShowNativeStorage();
	
	void runGroup(int startId, const QJsonArray & actions);
	bool run(const QJsonObject & action);

	void doExportToExcel(QString, QJsonArray, QJsonArray, bool);
	void doStart();

public slots:
	QString getInfo(QString, QString);
	void save(QString, QString);
	QString load(QString);
	QString openSaveFileDialog(QString);
	void exportToExcel(QString, QString, QString, bool);
	void onStart() { emit start(); }

signals:
	void start();

private:
	QString m_injectScriptID;
	QUrl m_urlHome;
	class WebEngineView * m_view;
	QMap<QString, QString> m_mapData;
	bool m_isRunning;
	bool m_isLoaded;
};

class WebEngineView : public QWebEngineView {
public:
	WebEngineView(QWidget* parent = Q_NULLPTR)
		:QWebEngineView(parent) {}
protected:
	virtual QWebEngineView *createWindow(QWebEnginePage::WebWindowType type) override;
};