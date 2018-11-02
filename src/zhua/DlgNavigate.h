#pragma once

namespace Ui { class DlgNavigate; }

class DlgNavigate : public QDialog{
	Q_OBJECT
public:
	static QString ShowNavigateDialog();

private:
	DlgNavigate(QWidget * parent = nullptr);
	~DlgNavigate();	

private:
	Ui::DlgNavigate *ui;
};