#pragma once

class MainWindow : public QMainWindow {
	Q_OBJECT

public:
	explicit MainWindow(QWidget * parent = nullptr);
	~MainWindow();

private:
	void initMenu();
	void onViewLoadFinished(bool ok);
	void onViewLoadProgress(int progress);
	void onViewLoadStarted();
	void slotNavigate();
	void slotHome();
	void inject();
	void slotShowDevTool();

public slots:
	QString getInfo(QString, QString);

signals:
	void getInfo_retrunValue(QString returnValue);

private:
	QString m_injectScriptID;
	QUrl m_urlHome;
	QWebEngineView * m_view;
};