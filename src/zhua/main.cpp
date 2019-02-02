#include "stdafx.h"
#include "MainWindow.h"

QMutex mutex;//日志代码互斥锁

struct AutoUnlock {
	QMutex & m_mutex;
	AutoUnlock(QMutex & mutex)
		: m_mutex(mutex) {}
	~AutoUnlock() {
		m_mutex.unlock();
	}
};

//日志生成
void logMsgOutput(QtMsgType type, const QMessageLogContext &context, const QString &msg)
{
	mutex.lock(); AutoUnlock _unlock(mutex);
	QByteArray localMsg = msg.toLocal8Bit();
	QString log;

	switch (type) {
	case QtDebugMsg:
		log.append(QString("Debug  File:%1 %2  Line:%3  Content:%4").arg(context.file).arg(context.function).arg(context.line).arg(msg));
		break;
	case QtInfoMsg:
		log.append(QString("Info: %1  %2  %3  %4").arg(localMsg.constData()).arg(context.file).arg(context.line).arg(context.function));
		break;
	case QtWarningMsg:
		log.append(QString("Warning: %1  %2  %3  %4").arg(localMsg.constData()).arg(context.file).arg(context.line).arg(context.function));
		break;
	case QtCriticalMsg:
		log.append(QString("Critical: %1  %2  %3  %4").arg(localMsg.constData()).arg(context.file).arg(context.line).arg(context.function));
		break;
	case QtFatalMsg:
		log.append(QString("Fatal: %1  %2  %3  %4").arg(localMsg.constData()).arg(context.file).arg(context.line).arg(context.function));
		// abort();
	}

	QFile file;
	QString path = QString("log.txt");
	file.setFileName(path);
	if (!file.open(QIODevice::ReadWrite | QIODevice::Append))
	{
		QString erinfo = file.errorString();
		return;
	}
	QTextStream out(&file);
	out << "\n\r" << log;
	file.close();
}


int main(int argc, char * argv[])
{

	qInstallMessageHandler(logMsgOutput);
	QCoreApplication::setAttribute(Qt::AA_EnableHighDpiScaling);
	QApplication app(argc, argv);

	MainWindow mainWindow;
	auto rect = Utils::GetCenterStartup(QSize(1280, 960));
	mainWindow.setGeometry(rect);
	mainWindow.show();

	return app.exec();
}