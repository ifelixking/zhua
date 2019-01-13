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
	void save(QString, QString);
	QString load(QString);

private:
	QString m_injectScriptID;
	QUrl m_urlHome;
	QWebEngineView * m_view;
	QMap<QString, QString> m_mapData;
};