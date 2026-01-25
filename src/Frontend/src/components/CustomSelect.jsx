import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Search } from 'lucide-react';
import './CustomSelect.css';

/**
 * Componente de Select Customizado
 * 
 * @param {Object} props
 * @param {string} props.label - Label do campo
 * @param {string} props.name - Nome do campo (para formulários)
 * @param {string} props.value - Valor selecionado
 * @param {function} props.onChange - Função chamada quando seleciona uma opção
 * @param {Array} props.options - Array de opções [{id, name, description?}]
 * @param {string} props.placeholder - Texto do placeholder
 * @param {boolean} props.required - Se o campo é obrigatório
 * @param {boolean} props.disabled - Se o campo está desabilitado
 * @param {boolean} props.showAddButton - Mostrar botão de adicionar
 * @param {function} props.onAddClick - Função chamada ao clicar em adicionar
 * @param {string} props.addButtonTitle - Título do botão adicionar
 * @param {boolean} props.searchable - Habilitar busca nas opções
 * @param {string} props.emptyMessage - Mensagem quando não há opções
 */
const CustomSelect = ({
    label,
    name,
    value,
    onChange,
    options = [],
    placeholder = 'Selecione uma opção',
    required = false,
    disabled = false,
    showAddButton = false,
    onAddClick,
    addButtonTitle = 'Adicionar novo',
    searchable = false,
    emptyMessage = 'Nenhuma opção disponível'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const selectRef = useRef(null);
    const searchInputRef = useRef(null);

    // Fechar dropdown ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focar no input de busca quando abre
    useEffect(() => {
        if (isOpen && searchable && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen, searchable]);

    // Filtrar opções baseado na busca
    const filteredOptions = searchable && searchTerm
        ? options.filter(option =>
            option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (option.description && option.description.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        : options;

    // Encontrar a opção selecionada
    const selectedOption = options.find(opt => String(opt.id) === String(value));

    const handleSelect = (option) => {
        onChange({
            target: {
                name,
                value: option.id
            }
        });
        setIsOpen(false);
        setSearchTerm('');
    };

    const handleToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div className="custom-select-wrapper" ref={selectRef}>
            {label && (
                <label className="custom-select-label">
                    {label}
                    {required && <span className="required-asterisk">*</span>}
                </label>
            )}

            <div className="custom-select-container">
                <div
                    className={`custom-select-trigger ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
                    onClick={handleToggle}
                >
                    <span className={`custom-select-value ${!selectedOption ? 'placeholder' : ''}`}>
                        {selectedOption ? selectedOption.name : placeholder}
                    </span>
                    <ChevronDown
                        size={18}
                        className={`custom-select-icon ${isOpen ? 'rotated' : ''}`}
                    />
                </div>

                {showAddButton && (
                    <button
                        type="button"
                        className="custom-select-add-btn"
                        onClick={onAddClick}
                        title={addButtonTitle}
                    >
                        <Plus size={20} />
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="custom-select-dropdown">
                    {searchable && (
                        <div className="custom-select-search">
                            <Search size={16} className="search-icon" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="custom-select-search-input"
                            />
                        </div>
                    )}

                    <div className="custom-select-options">
                        {filteredOptions.length === 0 ? (
                            <div className="custom-select-empty">
                                {searchTerm ? 'Nenhum resultado encontrado' : emptyMessage}
                            </div>
                        ) : (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.id}
                                    className={`custom-select-option ${String(option.id) === String(value) ? 'selected' : ''}`}
                                    onClick={() => handleSelect(option)}
                                >
                                    <span className="option-name">{option.name}</span>
                                    {option.description && (
                                        <span className="option-description">{option.description}</span>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
