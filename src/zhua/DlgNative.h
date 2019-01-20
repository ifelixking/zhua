#pragma once

namespace Ui { class DlgNative; }

class DlgNative : public QDialog {
	Q_OBJECT
public:
	static void ShowNativeDialog(const QMap<QString, QString> & data);

private:
	DlgNative(QWidget * parent, const QMap<QString, QString> & data);
	~DlgNative();
private slots:
	void itemClicked(QListWidgetItem *);
	void btnJsonClicked();

private:
	Ui::DlgNative *ui;
	const QMap<QString, QString> & m_data;
};
